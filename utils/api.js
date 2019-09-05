import http from './http' //引入二次封装的fly.js文件
const url_action = "wx.ashx?action=" //接口地址前部分

// 所有的api请求， 分get 和 post， 传入参数params
// request请求参数需要key的用http.fly_key, 不需要的用http.fly

// 用法：
// 1. 例如已经封装好getUserInfo的api，到需要的页面上先引入：
// import {
//   getUserInfo
// } from '../../utils/api' //需要调用哪个接口，就引入哪个，按需引入
// 2. 使用
// let params = {
//   name: 'Grs',
//   age: '18'
// }
// getUserInfo(params).then(res => { 
//   //获取到后台返回的res，并进行操作
// })


/** get请求，参数是json类型的 **/
const index_url = url_action + 'index'; // 首页展示,不带key
export const index = function (params) {
  return http.fly.get(index_url, params)
};

/** post请求，参数是json类型的 **/
const updateUser_url = url_action + 'updateUser'; // 提交更新用户信息，带key
export const updateUser = function (params) {
  return http.fly.get(updateUser_url, params, "post", )
};