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
var user_openid
const chat = require('../../utils/chat1.js')
var face_openid
var timershow
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
		userData:'',
		openid: '',
		user_id: '',
		user_msg: '',
		// 客服数据
		serverData: '',
		face_id: '',
		face_msg: [],
		msgList: '',
		// 可视化数据
		chat_visaul:[],
    timer:'',
    // ceshi
    ceshi:100,
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
    console.log('页面创建')
		console.log("options",options)
		var that = this
		// 初始化
		// 1.获取传入的face_openid
		face_openid = options.openid
		// 2.获取对方和用户头像和昵称
		db.collection('message').where({
			_openid:face_openid
		}).get().then(res=>{
			that.setData({
				serverData:res.data[0]
			})
		})
		var promise160 = new Promise(function(resolve,reject){
			chat.user_openid(resolve)
		})
		promise160.then(res=>{
      user_openid = res
			db.collection('message').where({
				_openid: res
			}).get().then(res => {
				that.setData({
					userData: res.data[0] 
				})
			})
		})
		// 3.获取与对方聊天的本地缓存
		var chatCache
		console.log('face_openid', face_openid)
		var promise17 = new Promise(function(resolve,reject){
			chat.getChatCache(face_openid,resolve)
		})
		promise17.then(res=>{

			chatCache = res
			that.setData({
				chat_visaul:res
			})
      console.log('写入chat_visaul',that.data.chat_visaul)
      console.log(typeof user_openid)
      // 定时器 加载对方消息
      that.setData({
        timer: setInterval(function(){
          if (typeof user_openid == 'undefined') {
            var promise188 = new Promise(function (resolve, reject) {
              chat.user_openid(resolve)
            })
            promise188.then(res => {
              user_openid = res
              chat.get_face_msg(user_openid, face_openid, that)
            })
          } else {
              chat.get_face_msg(user_openid, face_openid, that)
            
            
            that.setData({
              chat_visaul:that.data.chat_visaul
            })
          }
        },3000)
      })
      
      
      
		})

	},
  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
    console.log('页面出现在前台时执行')
    
    
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
			toView: 'msg-' + (this.data.chat_visaul.length - 1),
			inputVal:''
		})

	},

  /**
   * 发送点击监听
   */
	sendClick: function (e) {
		var that = this
		msgList = that.data.chat_visaul
    let aa = msgList
    console.log('发送开始，获取本地chatvisaul',aa)
		msgList.push({
			speaker: 'customer',
			contentType: 'text',
			content: e.detail.value
		})
    console.log('向chatvisaul存入自己的聊天记录')
		inputVal = '';
		
		//保存聊天数据到本地
		//判断数据是否超出500条，超出删除再保存
		let msg = msgList
		let msgl = msgList.length
		if (msg.length > 500) {
			msg.copyWithin(0, mas.length - 500)
			while (msgl - 500) {
				msg.pop()
				msgl--
			}
		}
		that.setData({
			chat_visaul: msg
		});
    console.log('写入页面可视化', msg)
		// 获取服务器时间后上传消息
		chat.write_face_message(face_openid,user_openid, e.detail.value)
		console.log('将要保存',msg)
		chat.setChatCache(that.data.serverData._openid,msg)
	},
	/**
   * 监听页面隐藏
   */
	onHide: function () {
    console.log('页面隐藏')
    timershow = 1
	},
	/**
	* 监听页面卸载
	*/
	onUnload: function () {
    console.log('页面卸载')
    clearInterval(this.data.timer)
    timershow = 1
	},
  /**
   * 退回上一页
   */
	toBackClick: function () {
    console.log('退回上一页')
    clearInterval(this.data.timer)
    timershow = 1
		wx.navigateBack({})
    
	}

})