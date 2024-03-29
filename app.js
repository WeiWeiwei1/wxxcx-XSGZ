//app.js
wx.cloud.init()
const db = wx.cloud.database()
const chat = require('utils/chat1.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
	// 设置一个定时器,获取未读消息数
	set_timer: function () {
		var that = this
		this.globalData.timer = setInterval(function () {
			chat.get_noread_count(that)
		}, 2000)
	},
  globalData: {
    userInfo: null,
		// 相机页数据
		srcFirst: "",
		srcSecond: "",
		srcThird: "",
		used: 1,
		timer: '',
		count: 0,
		tabbarlist: ['../Home_page/home?index=0', '../Category_page/category?index=1', '../chatlist/chatlist?index=2', '../Zhuce_page/zhuce?index=3'],
    user_openid:'',
	}
  
})