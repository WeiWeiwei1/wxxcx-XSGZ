// pages/Zhuce_page/zhuce.js
const app = getApp()
console.log(app.globalData)
wx.cloud.init()
const db = wx.cloud.database()
const chat = require('../../utils/chat1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 我的收藏列表
    collectible:[],
    // 我的浏览列表
    browsed:[],
    // 我的购买列表
    buy:[],
    // 我的商品列表
    myComodity:[],
    // 我的分享
    share:[],
		// tabbar
		active: 3,
		icon: {
			normal: '//img.yzcdn.cn/icon-normal.png',
			active: '//img.yzcdn.cn/icon-active.png'
		},
		count: '',
		// 用户信息
		user_openid: '',
		avatarUrl: '',
		name: '',
  
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
  zhuce: function () {
    wx.cloud.callFunction({
      // 瑕佽皟鐢ㄧ殑浜戝嚱鏁板悕绉?
      name: 'user_add',
      // 浼犻€掔粰浜戝嚱鏁扮殑event鍙傛暟
      data: {
        type: "add_user"
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      // handle error
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
    // 获取当前app用户信息权限 信息
	
		var promise1 = new Promise(function(resolve,reject){
			 chat.user_openid(resolve)
		})
		promise1.then(res=>{
			that.setData({
				user_openid: res
			}) 	
		})
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
					name:res.nickName
        })
				
      }
			
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
					
        }
      })
    }
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
  getUserInfo: function (e) {
		var that = this
    console.log(e)
		this.zhuce()
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
		var promise2 = new Promise(function (resolve, reject) {
			console.log()
			chat.add_user(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl, resolve)
		})
		promise2.then(res => {
			console.log('上传用户user成功')
		})
		var promise3 = new Promise(function(resolve,reject){
			chat.add_message( e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl, resolve)
		})
		promise3
  }
})