// pages/chat/chat.js
// pages/contact/contact.js
const app = getApp();
var util = require('../../utils/util.js')
// 用户键盘输入的内容
var inputVal = '';
// 所有消息总和（用户和客服放在一起）
var msgList = [];
// 获取手机屏幕宽高
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
wx.cloud.init();
const db = wx.cloud.database();
var server_openid

/**
 * 初始化数据
 */
function initData(that) {
	inputVal = '';
	var chatData
	// 初始化聊天内容，获取数据库中保存的内容，获取本地的内容

	wx.getStorage({
		key: 'chatData' + server_openid,
		success(res) {
			console.log(res.data)
			msgList = res.data
			that.setData({
				msgList,
				inputVal
			})
			console.log('获取本地成功', msgList)
		},
		fail(err) {

			msgList = [{
				speaker: 'server',
				contentType: 'text',
				content: '可以开始聊天了'
			},
			{
				speaker: 'customer',
				contentType: 'text',
				content: '可以开始聊天了'
			}
			]
			console.log('获取本地失败', msgList)
			that.setData({
				msgList,
				inputVal
			})
		}
	})

}

/**
 * 计算msg总高度
 */
// function calScrollHeight(that, keyHeight) {
//   var query = wx.createSelectorQuery();
//   query.select('.scrollMsg').boundingClientRect(function(rect) {
//   }).exec();
// }

Page({

  /**
   * 页面的初始数据
   */
	data: {
		scrollHeight: '100vh',
		inputBottom: 0,
		//用户数据
		userInfo: {},
		openid: '',
		user_id: '',
		user_msg: '',
		// 客服数据
		serverData: '',
		face_id: '',
		face_msg: [],
		msgList: ''
	},
	// 获取服务器时间
	get_time: function (op) {
		var that = this
		wx.cloud.callFunction({
			name: 'getstep',
			success: function (res) {
				console.log(res.result.time)
				return res.result.time
			}
		})
	},
	//上传消息到消息数据库
	upMessage: function (string) {
		var that = this
		//处理添加聊天数据
		var new_msg = that.data.face_msg
		var count = ''
		for (let i = 0; i < new_msg.length; i++) {
			if (new_msg[i].face_openid == that.data.openid) {
				count = i
			}
		}
		console.log(typeof count)
		if (typeof count == 'string') {
			new_msg.unshift({ face_openid: that.data.openid, contant: [string] })
			for (let j = 0; j < new_msg.length; j++) {
				if (new_msg[j].face_openid == that.data.openid) {
					count = j
				}
			}
		}
		console.log(count)
		new_msg[count].contant.push(string)
		//把该自己置顶
		var a = new_msg[count]
		if (count != 0) {
			new_msg.copyWithin(count, count + 1)
			new_msg.pop()
			new_msg.unshift(a)
		}
		console.log("new_msg", new_msg)
		wx.cloud.callFunction({
			name: 'upmessage',
			data: {
				face_id: that.data.face_id,
				message: new_msg,
				user_openid: that.data.openid,
				server_openid: that.data.serverData._openid
			},
			success: function (res) {
				console.log("发送成功")
			}
		})
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		var that = this
		that.get_time()
		console.log("options Chat_Page", options)
		server_openid = options.openid
		initData(this);
		// 获取用户头像
		wx.getUserInfo({
			success: res => {
				this.setData({
					cusHeadIcon: res.userInfo.avatarUrl,
					userInfo: res.userInfo
				})
			}
		})
		//获取客服信息
		server_openid = options.openid
		db.collection('user').where({
			//options中变量，由上一个页面传入
			_openid: server_openid
		}).get().then((res) => {
			that.setData({
				serverData: res.data[0]
			})
		})
		//获取用户openid
		wx.cloud.callFunction({
			name: 'getopenid',
			data: {},
			success: function (res) {
				that.setData({
					openid: res.result.openid,
					face_openid: options.openid
				})
				//获取对面的message _id

				db.collection('message').where({
					_openid: options.openid
				}).get().then(res => {
					if (res.data.length == 0) {
						wx.cloud.callFunction({
							name: 'addmessage',
							data: {
								avatarUrl: that.data.serverData.avatarUrl,
								name: that.data.serverData.nickName
							},
							success: function () {
								db.collection('message').where({
									_openid: options.openid
								}).get().then(res => {
									console.log(res)
									that.setData({
										face_id: res.data[0]._id,
										face_msg: res.data[0].msg
									})
									console.log('初始化完成')
								})
							}
						})
					} else {
						console.log(res)
						that.setData({
							face_id: res.data[0]._id,
							face_msg: res.data[0].msg
						})
						console.log('初始化完成')
					}
				})
			}
		})

	},
  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {

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
   * 获取聚焦
   */
	focus: function (e) {
		keyHeight = e.detail.height;
		this.setData({
			scrollHeight: (windowHeight - keyHeight) + 'px'
		});
		this.setData({
			toView: 'msg-' + (msgList.length - 1),
			inputBottom: keyHeight + 'px'
		})
		//计算msg高度
		// calScrollHeight(this, keyHeight);

	},

	//失去聚焦(软键盘消失)
	blur: function (e) {
		this.setData({
			scrollHeight: '100vh',
			inputBottom: 0
		})
		this.setData({
			toView: 'msg-' + (msgList.length - 1)
		})

	},

  /**
   * 发送点击监听
   */
	sendClick: function (e) {
		var that = this
		msgList.push({
			speaker: 'customer',
			contentType: 'text',
			content: e.detail.value
		})
		inputVal = '';
		that.setData({
			msgList,
			inputVal
		});
		//保存聊天数据到本地
		//判断数据是否超出500条，超出删除再保存
		var msg = msgList
		let msgl = msgList.length
		if (msg.length > 500) {
			msg.copyWithin(0, mas.length - 500)
			while (msgl - 500) {
				msg.pop()
				msgl--
			}
		}
		// 获取服务器时间后上传消息
		wx.cloud.callFunction({
			name: 'getstep',
			success: function (res) {
				console.log(res.result.time)
				that.upMessage({ s: e.detail.value, time: res.result.time })
			}
		})
		wx.setStorage({
			key: 'chatData' + this.data.server_openid,
			data: msg
		})
	},
	/**
   * 监听页面隐藏
   */
	onHide: function () {

	},
	/**
	* 监听页面卸载
	*/
	onUnload: function () {

	},
  /**
   * 退回上一页
   */
	toBackClick: function () {
		wx.navigateBack({})
	}

})