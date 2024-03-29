// pages/Category_page/category.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    category:['手机数码','电脑办公','家用电器','食品生鲜','玩具乐器','家居厨具','图书文娱','生活旅行'],
    book:['文学小说','考研图书','人文社科','经管励志','艺术','IT科技','文娱','生活'],
		// tabbar
		active: 1,
		icon: {
			normal: '//img.yzcdn.cn/icon-normal.png',
			active: '//img.yzcdn.cn/icon-active.png'
		},
		count: '',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
		// 写入消息数
		app.set_timer(that)
		setInterval(function () {
			that.setData({
				count: app.globalData.count
			})
		}, 1000)
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