// pages/Home_page/home.js
const app = getApp()
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
	// tabbar
	onChange(event) {
		console.log(event.detail);
		var tabbarlist = app.globalData.tabbarlist
		wx.redirectTo({
			url: tabbarlist[event.detail]
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