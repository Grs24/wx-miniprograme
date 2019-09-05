// import {
//   fly,
//   fly_key
// } from '../../utils/http'
import {
  index
} from '../../utils/api'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigation: {
      loading: false,
      color: '#000',
      background: 'transparent',
      show: true,
      animated: false,
      back: true,
      title: "demo",
    },
    tabbar: {
      list: [{
          text: "首页",
          iconPath: "/assets/images/icon_home.png",
          selectedIconPath: "/assets/images/icon_home-on.png",
        },
        {
          text: "我的",
          iconPath: "/assets/images/icon_mine.png",
          selectedIconPath: "/assets/images/icon_mine-on.png",
          badge: 'New'
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // fly.get("wx.ashx?action=index").then(function (d) {
    //   console.log(d);
    // })

    let params = {}
    index(params).then((result) => {
      console.log(result);
    }).catch((err) => {

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabChange(e) {
    console.log('tab change', e)
  }
})