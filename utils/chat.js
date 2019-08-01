wx.cloud.init()
const db = wx.cloud.database()

// 获取用户openid
const user_openid = function(resolve) {
  wx.cloud.callFunction({
    name: 'getopenid',
    success: function(res) {
      console.log('chat.js已返回user_openid', res)
			resolve(res.result.openid) 
    }
  })
}
// 获取服务器时间
const yun_time = function(resolve) {
  wx.cloud.callFunction({
    name: 'getopenid',
    success: function(res) {
			console.log('获取服务器时间成功', res.result.time)
			resolve(res.result.time)
    }
  })
}
//转换时间戳为时间---format = 'h:s' => 12:34
const formattime = function(number, format) {
  var n = format

  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  if (number != null) {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']; //
    var returnArr = [];


    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));
    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));


    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    //format.replace(/\//g,'-');
    if (n == 'h/m') {
      return format.replace(/\//g, ':');
    } else {
      return format.replace(/\//g, '-');
    }
  } else {
    return number;
  }
}
// 新建用户个人信息到user   add_user  59
const add_user = function(openid, name, avatarUrl, resolve) {
  wx.cloud.callFunction({
    name: 'adduser',
    data: {
      openid: openid, //用户自己的openid
      name: name, //用户名
      avatarUrl: avatarUrl //用户头像地址
    },
    success: function(res) {
      console.log('“${name}”用户的user新建成功', res)
      resolve()
    }
  })
}
// 新建用户聊天数据库message  
const add_message = function(openid, name, avatarUrl, resolve) {
  wx.cloud.callFunction({
    name: 'addmessage',
    data: {
      openid: openid,
      name: name,
      avatarUrl: avatarUrl
    },
    success: function(res) {
      console.log('“${name}”用户message创建成功')
      resolve()
    }
  })
}
// 通过商品id获取对方openid-----在Promise中执行，必须传入resolve   getOpenidByComodityId   90
const getOpenidByComodityId = function(comodity_id, resolve) {
  db.collection('comodity').where({
    comodity_id: comodity_id
  }).get().then(res => {
    resolve(res.data[0].openid)
  })
}
// 取出chatlist缓存----key = 'chatlist',,,,getChatlistCache   98
const getChatlistCache = function(openid, resolve) {
  wx.getStorage({
    key: 'chatlist', //缓存名
    success(res) {
      console.log('获取本地chatlist缓存成功', res.data)
      resolve(res.data)
    },
    fail(err) {
      console.log('本地暂无chatlist缓存，传出[]')
      resolve([])
    }
  })
}
// 保存chatlist缓存到本地----key = 'chatlist',contant = 数据   setChatlistCache  112 
const setChatlistCache = function(chatlist, resolve) {
  wx.setStorage({
    key: "chatlist",
    data: chatlist
  })
}



// 新建chatlist模板，并添加到chatlist本地缓存中（更新chatlist模板）---this.data.chatlist_visual 
const make_chatlist = function(gather, contant) {
  // 由详细信息制作集合  (openid的详细信息，该用户message 中openid的count数组)
  // { avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/bIuHOWBgkPrXtXwIpZqlKQEeNHO5tPoyxgSGS5yEfEMyyicOKeD7KINY5z3CV1ib6drGm7GJTlkbJhtzibMR5z5aw/132', name: '余生还好', newmsg: '你好', newtime: '9:55', count: 6 }
  //空 集合
  var empty = {
    openid: '',
    avatarUrl: '',
    name: '',
    newmsg: '',
    newtime: '',
    count: 0
  }
  // 填充数据
  empty.openid = contant.face_openid
  empty.avatarUrl = gather.avatarUrl
  empty.name = gather.nickName
  if (contant.contant.length == 0) {
    empty.newmsg = ''
    empty.newtime = ''
  } else {
    empty.newmsg = contant.contant[contant.contant.length - 1].s
    empty.newtime = that.formattime(contant.contant[contant.contant.length - 1].time, 'h/m')
  }
  console.log('contant.contant', contant.contant)
  // 获取所有云数据库msg.contant
  empty.count = contant.contant.length
  return empty
}


// 取出chat缓存----key = 'chat'+openid   getChatCache    153
const getChatCache = function(openid,resolve){
	wx.getStorage({
		key: 'chat'+openid, //缓存名
		success(res) {
			console.log('获取本地chatlist缓存成功', res.data)
			resolve(res.data)
		},
		fail(err) {
			console.log('本地暂无chatlist缓存，传出[]')
			resolve([{
				speaker: 'server',
				contentType: 'text',
				content: '可以开始聊天了'
			},
			{
				speaker: 'customer',
				contentType: 'text',
				content: '可以开始聊天了'
			}
			])
		}
	})
}


// 保存chat缓存----key = 'chat'+openid,contant = 数据     setChatCache      179
const setChatCache = function(openid,contant){
	wx.setStorage({
		key: "chatlist",
		data: contant
	})
}


// 新建chat用户信息模板，并添加到chat本地缓存 ----写入this.data.chat_visual  make_chat  188
const  make_chat = function(type,contant,that){
	var empty1 = {
		speaker: type,//用于区别'servser','customer',必须是字符串
		contentType: 'text',
		content: contant
	}
	var chatCache 
	var promise = new Promise(function(resolve,reject){
		chatCache = getChatCache(openid,resolve)
	})
	promise.then(res=>{
		chatCache.push(empty1)
		that.setDat({
			chat_visual:chatCache
		})
		setChatCache(openid,chatCache)
	})	
}


// 获取对方message数据库信息，并向其写入自己发送的信息  write_face_message   208
const write_face_message = function(face_openid,user_openid,s){
	// 获取服务器时间
	var promise1 = new Promise(function(resolve,reject){
		yun_time(resolve)
	}).then(res=>{
		var nowtime = res
		// 获取对方massage数据库
		var promise2 = new Promise(function (resolve, reject) {
			db.collection('message').where({
				_openid : face_openid
			}).get().then(res=>{
				console.log('获取到对方message',res.data[0])
				var msg = res.data[0].msg
				var id = res.data[0]._id     //对方message的_id
				for(let i = 0; i<msg.length;i++){
					if (msg[i].face_openid == user_openid){
						msg[i].contant.push({s:s,time:nowtime})
						// 上传到对方数据库
						wx.cloud.callFunction({
							name:'upmessage',
							data:{
								face_id:id,
								message:msg
							},
							success:function(res){
								console.log('已上传到对方message数据库中')
							}
						})
					}	
				}
			})
		})
	})
}


// 获取对方user数据库信息    get_face_user   246
const get_face_user = function(face_openid,resolve){
	db.collection('user').where({
		_openid:face_openid
	}).get().then(res=>{
		console.log('获取对方user成功',res)
		resolve(res)
	})
}


// 在chat页面，接受对方消息----从message数据库取出自己的msg，加载成可视化chat_visaul,保存到本地chat缓存       get_face_msg      257
const get_face_msg = function(user_openid,face_openid,that){
	var promise3 = new Promise(function(resolve,reject){
		db.collection('message').where({
			_openid:user_openid
		}).get().then(res=>{
			var user_msg = res.data[0].msg
			console.log('获取自己msg成功',user_msg)
			var promiseArr1 = []
			for (let j = 0; j < user_msg.length;j++){
				if(face_openid == user_msg[j].face_openid){
					
					for (let k = 0; k < user_msg[j].contant.length;k++){
						promiseArr1.push(function(resolve,reject){
							//const make_chat = function (type, contant, that)
							make_chat('server', user_msg[j].contant[k],that)
							resolve()
						})
						if (j == user_msg.length-1 && k == user_msg[j].contant.length-1){
							Promise.all(promiseArr1).then(res=>{
								console.log('保存到本地缓存成功,可视化成功')
								// 清空云端未读
								user_msg[j].contant = []
								db.collection('message').where({
									_openid:user_openid
								}).get().then(res=>{
									var id2 = res.data[0]._id
									wx.cloud.callFunction({
										name: 'upmessage',
										data: {
											face_id: id2,
											message: user_msg
										},
										success: function () {
											console.log('云端未读清空成功')
										}
									})
								})
							})
						}
					}
				}
			}	
		})
	})
}
/*
	app.中使用的方法
*/
// 获取自己的  message 中 msg，将不为[]的，统计总个数(length相加)，写入tabbar.count  每1s执行一次   get_noread_count  306
const get_noread_count = function(user_openid,that){
	db.collection('message').where({
		_openid:user_openid
	}).get().then(res=>{
		// res.data[0].msg
		let m = 0
		for (let l = 0; l < res.data[0].msg.length;l++){
			m = res.data[0].msg[l].contant.length + m
			if (l == res.data[0].msg.length - 1){
				that.globalData.count = m
			}
		}
	})
}
module.exports = {

  // 获取用户openid
  user_openid: user_openid,//js:5

  // 获取服务器时间
  yun_time: yun_time,//js:15

	// 新建用户个人信息到user
	add_user:add_user,//js:59

	// 新建用户聊天数据库message 
	add_message:add_message,//js:75

	// 通过商品id获取对方openid-----在Promise中执行，必须传入resolve 
	getOpenidByComodityId: getOpenidByComodityId,//js:90

	// 取出chatlist缓存----key = 'chatlist',,,
	getChatlistCache: getChatlistCache,//js:98

	// 保存chatlist缓存到本地----key = 'chatlist',contant = 数据    
	setChatlistCache: setChatlistCache,//js:112

	// 新建chatlist模板，并添加到chatlist本地缓存中（更新chatlist模板）---this.data.chatlist_visual
	make_chatlist: make_chatlist,//js:112

	// 取出chat缓存----key = 'chat'+openid 
	getChatCache: getChatCache,//js:153

	// 保存chat缓存----key = 'chat'+openid,contant = 数据  
	setChatCache: setChatCache,//js:179

	// 新建chat用户信息模板，并添加到chat本地缓存 ----写入this.data.chat_visual 
	make_chat: make_chat,//js:188

	// 获取对方message数据库信息，并向其写入自己发送的信息 
	write_face_message: write_face_message,//js:208

	// 获取对方user数据库信息    
	get_face_user: get_face_user,//js:246

	// 在chat页面，接受对方消息----从message数据库取出自己的msg，加载成可视化chat_visaul,保存到本地chat缓存     
	get_face_msg: get_face_msg,//js:257

	// 获取自己的  message 中 msg，将不为[]的，统计总个数(length相加)，写入tabbar.count  每1s执行一次  
	get_noread_count: get_noread_count,//js:306

}