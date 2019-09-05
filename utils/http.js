// 由于实际项目要求， 故作了以下的修改：
// 1，请求分为必须带session_key和不带session_key，不带session_key的请求直接使用flyio的请求
//    要带session_key的请求作二次封装
// 2，需带session_key的请求， 让session_key作为请求参数提交给后台


// 二次封装fly请求以及添加拦截器
const Fly = require("./wx.js") //fly请求
const config = require('./config.js') //引入配置文件
const fly_key = new Fly(); //创建fly实例,带key请求
const fly = new Fly(); //创建fly实例

let key = wx.getStorageSync("session_key")

//实例级配置
fly_key.config.timeout = 5000;

//定义公共headers
fly_key.config.headers = {
  "x-tag": "flyio"
}

//配置请求基地址
fly_key.config.baseURL = config.apiUrl
fly.config.baseURL = config.apiUrl


// 实例一个新的fly
// var newFly = new Fly;

// newFly.config = fly_key.config;

//二次封装，添加请求拦截器
fly_key.interceptors.request.use(function (request) {
  //本次请求的超时时间
  request.timeout = 5000
  //打印出请求体
  // console.log(request.body)

  // 每次请求带上session_key
  request.body.key = key

  console.log(`1.发起请求：path:${request.url},baseURL:${request.baseURL},请求参数：`, request.body)

  if (request.body.key) { //检查本地缓存是否有session_key存在,没有则重新获取
    // request.headers = { //设置请求头
    //   "content-type": "application/json",
    //   "is_register": wx.getStorageSync('is_register')
    // }
  } else {
    console.log("2.session_key不存在，重新获取,锁住请求");
    fly_key.lock(); //锁住请求
    return getSKey().then((res) => {
      console.log('3.成功更新session_key:', res.data.data.s_key, "is_register", res.data.data.is_register);
      wx.setStorageSync("session_key", res.data.data.s_key); //缓存session_key
      wx.setStorageSync("is_register", res.data.data.is_register); //缓存is_register,是否新用户


      // 更新请求参数里的session_key
      key = res.data.data.s_key
      request.body.key = key

      console.log(`4.解锁请求,继续之前的请求：请求地址:${request.url},请求参数：`, request.body)

      // request.headers = { //设置请求头
      //   "content-type": "application/json",
      //   "is_register": wx.getStorageSync('is_register')
      // }

      return request; //继续之前的请求

    }).finally(() => {
      fly_key.unlock() //解锁后，会继续发起请求队列中的任务
    })
  }
})

//二次封装，添加响应拦截器//不要使用箭头函数，否则调用this.lock()时，this指向不对
fly_key.interceptors.response.use(function (response) {
    // console.log("response", response);
    console.log(`2.response,发起请求：请求地址:${response.request.url},请求参数：`, response.request.body)

    // 时间间隔， 防止多次重复请求登录态session_key
    let currentTime = new Date().getTime()
    let lastSendTime = wx.getStorageSync("lastSendTime") ? wx.getStorageSync("lastSendTime") : currentTime
    let intervalTime = currentTime - lastSendTime
    let timeout = 1000 //设置时间间距范围，超出该时间值则发起获取session_key请求
    console.log("currentTime", currentTime, "lastSendTime", lastSendTime, "intervalTime", intervalTime);

    //验证失效
    if (response.data.status === -1 && (intervalTime > timeout || intervalTime === 0)) {

      console.log("3.response,session_key失效，重新获取,锁住请求");

      this.lock(); //锁定响应拦截器，

      return getSKey().then(function (res) {
        console.log('4.response,成功更新session_key:', res.data.data.s_key, "is_register", res.data.data.is_register);
        wx.setStorageSync("session_key", res.data.data.s_key); //缓存session_key
        wx.setStorageSync("is_register", res.data.data.is_register); //缓存is_register,是否新用户
        let lastSendTime = new Date().getTime()
        wx.setStorageSync("lastSendTime", lastSendTime); //记录已经获得session_key的当前时间值

        // request.headers = { //设置请求头
        //   "content-type": "application/json",
        //   "is_register": wx.getStorageSync('is_register')
        // }

        // 更新请求参数里的session_key
        key = res.data.data.s_key
        response.request.body.key = key

      }).finally(() => {

        this.unlock() //解锁后，会继续发起请求队列中的任务

        // 清空时间间隔
        intervalTime = null

      }).then(() => {

        console.log(`5.response,解锁请求,继续之前的请求：请求地址:${response.request.url},请求参数：`, response.request.body)
        return fly_key.request(response.request); //继续之前的请求

      })
    } else if (response.data.status === -1 && (intervalTime < timeout)) {

      key = wx.getStorageSync("session_key") //再次获取最新的session_key
      response.request.body.key = key
      console.log(`5.response,已经更新了session_key，继续之前请求：请求地址:${response.request.url},请求参数：`, response.request.body)
      return fly_key.request(response.request); //继续之前的请求

    } else {
      console.log("3.response,返回response", response);
      return response;
    }
  },
  function (err) {
    // console.log("响应拦截器,error-interceptor", err)
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('错误请求')
          break;
        case 401:
          console.log('未授权，请重新登录')
          break;
        case 403:
          console.log('拒绝访问')
          break;
        case 404:
          console.log('请求错误,未找到该资源')
          break;
        case 405:
          console.log('请求方法未允许')
          break;
        case 408:
          console.log('请求超时')
          break;
        case 500:
          console.log('服务器端出错')
          break;
        case 501:
          console.log('网络未实现')
          break;
        case 502:
          console.log('网络错误')
          break;
        case 503:
          console.log('服务不可用')
          break;
        case 504:
          console.log('网络超时')
          break;
        case 505:
          console.log('http版本不支持该请求')
          break;
        default:
          console.log(`连接错误${err.response.status}`)
      }
    } else {
      console.log('连接到服务器失败')
    }
    return Promise.resolve(err.response)
  }
)

// 获取session_key
function getSKey() {

  return new Promise((resolve, reject) => {

    // 1.换取code
    wx.login({
      success(res) {
        if (res.code) {
          //2.发送code，获取session_key
          wx.request({
            url: config.apiUrl + "login",
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res02) {
              resolve(res02)
            }
          })

        } else {
          // console.log('登录失败！' + res.errMsg)
          reject(res)
        }
      }
    })

  });
}

module.exports = {
  fly_key: fly_key,
  fly: fly
}