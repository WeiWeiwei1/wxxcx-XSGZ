// pages/Home_page/home.js
wx.cloud.init()
const db = wx.cloud.database()
const app = getApp()
var chat = require('../../utils/chat1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
		// tabbar
		count: "",
		active: 0,
		icon: {
			normal: '//img.yzcdn.cn/icon-normal.png',
			active: '//img.yzcdn.cn/icon-active.png'
		}
		// ----

  },
  // 点击上架商品
  clickshang:function(){
    wx.navigateTo({
      url: '../Commodity_page/commodity'
    })
  },
	// tabbar
	onChange(event) {
		console.log(event.detail);
		var a 
		var tabbarlist = app.globalData.tabbarlist
		a = event.detail
		if (event.detail == 3){a = 2}
		if(event.detail == 2){a=3}
		wx.redirectTo({
			url: tabbarlist[a]
		})
	},
	// ----
	goto_comodity:function(){
		wx.navigateTo({
			url: '../index/index'
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
    var promise5 = new Promise(function(resolve,reject){
      chat.user_openid(resolve)
    })
    promise5.then(res=>{
      app.globalData.user_openid = res
    })
    app.set_timer(that)
		setInterval(function () {
			that.setData({
				count: app.globalData.count
			})
		}, 1000)
		// setInterval(function () {
		// 	that.setData({
		// 		count: app.globalData.count
		// 	})
		// }, 1000)

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

  }
})