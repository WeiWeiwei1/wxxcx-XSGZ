wx.cloud.init()
const db = wx.cloud.database()
const app = getApp()
// 获取用户openid
const user_openid = function(resolve) {
  wx.cloud.callFunction({
    name: 'getopenid',
    success: function(res) {
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
const add_user = function(name, avatarUrl, resolve) {
  var promise1 = new Promise(function(resolve2, reject) {
    user_openid(resolve2)
  }).then(res => {
    var user_openid1 = res
    db.collection('user').where({
      _openid: res
    }).get().then(res => {
      if (res.data.length == 0) {

        wx.cloud.callFunction({
          name: 'adduser',
          data: {
            openid: user_openid1, //用户自己的openid
            name: name, //用户名
            avatarUrl: avatarUrl //用户头像地址
          },
          success: function(res) {
            console.log('${name}用户的user新建成功', res)
          }
        })
      } else {
        console.log('已创建user')
      }

    })
  })


}
// 新建用户聊天数据库message  已有则不执行
const add_message = function(name, avatarUrl, resolve) {
  var promise4 = new Promise(function(resolve, reject) {
    user_openid(resolve)
  }).then(res => {
    var user_openid = res
    db.collection('message').where({
      _openid: user_openid
    }).get().then(res => {
      if (res.data.length == 0) {
        wx.cloud.callFunction({
          name: 'addmessage',
          data: {
            openid: user_openid,
            name: name,
            avatarUrl: avatarUrl
          },
          success: function(res) {
            console.log('“${name}”用户message创建成功')
            resolve()
          }
        })
      } else {
        console.log('该用户message已创建')
        resolve()
      }
    })


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
const getChatCache = function(face_openid, resolve) {
  wx.getStorage({
    key: 'chat' + face_openid, //缓存名
    success(res) {
      console.log('获取本地chat缓存成功', res.data)
      resolve(res.data)
    },
    fail(err) {
      console.log('本地暂无chat缓存，传出[]')
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


// 保存chatlist缓存----key = 'chat'+openid,contant = 数据     setChatCache      179
const setChatCache = function(openid, contant) {
  wx.setStorage({
    key: "chat" + openid,
    data: contant
  })
  console.log('保存chat缓存,缓存名:' + "chat" + openid)
}


// 新建chat用户信息模板，并添加到chat本地缓存 ----写入this.data.chat_visual  
const make_chat = function(type, contant, that, resolve, face_openid) {
  console.log('执行make_chat')
  var empty2 = {
    speaker: type, //用于区别'servser','customer',必须是字符串
    contentType: 'text',
    content: contant.s
  }
  console.log('empty2', empty2)
  console.log('make_chat中chat_visaul', that.data.chat_visaul)
  var chatCache = that.data.chat_visaul
  console.log('typeof chatCache', typeof chatCache)
  chatCache.push(empty2)
  that.setData({
    chat_visual: chatCache
  })
  console.log('对面消息添加到本页成功')
  setChatCache(face_openid, chatCache)
  resolve()
}


// 获取对方message数据库信息，并向其写入自己发送的信息  write_face_message   208
const write_face_message = function(face_openid, user_openid, s) {
  // 获取服务器时间
  var promise24 = new Promise(function(resolve, reject) {
    yun_time(resolve)
  })
  promise24.then(res => {
    var nowtime = res
    // 获取对方massage数据库
    db.collection('message').where({
      _openid: face_openid
    }).get().then(res => {
      console.log('获取到对方message', res.data[0])
      var msg = res.data[0].msg
      var id = res.data[0]._id //对方message的_id
      //处理添加聊天数据
      var new_msg = msg
      var count = ''
      for (let i = 0; i < new_msg.length; i++) {
        if (new_msg[i].face_openid == user_openid) {
          count = i
        }
      }
      console.log(typeof count)
      if (typeof count == 'string') {
        new_msg.unshift({
          face_openid: user_openid,
          contant: [{
            s: s,
            time: nowtime
          }]
        })
        for (let a = 0; a < new_msg.length; a++) {
          if (new_msg[a].face_openid == face_openid) {
            count = a
          }
        }
      } else {
        console.log(count)
        new_msg[count].contant.push({
          s: s,
          time: nowtime
        })
        //把该自己置顶
        var a = new_msg[count]
        new_msg.copyWithin(count, count + 1)
        new_msg.pop()
        new_msg.unshift(a)

      }
      var mm = new_msg
      console.log("mm", mm)
      console.log('id', id)

      wx.cloud.callFunction({
        name: 'upmessage',
        data: {
          face_id: id,
          message: mm
        },
        success: function(res) {
          console.log("发送成功")
        }
      })



      // for (let i = 0; i < msg.length; i++) {
      // 	if (msg[i].face_openid == user_openid) {
      // 		msg[i].contant.push({ s: s, time: nowtime })
      // 		// 上传到对方数据库
      // 		wx.cloud.callFunction({
      // 			name: 'upmessage',
      // 			data: {
      // 				face_id: id,
      // 				message: msg
      // 			},
      // 			success: function (res) {
      // 				console.log('已上传到对方message数据库中')

      // 			}
      // 		})
      // 		if (i == msg.length-1){

      // 				msg.push({ contant: { s: s, time: nowtime }, face_openid: face_openid })
      // 				wx.cloud.callFunction({
      // 					name: 'upmessage',
      // 					data: {
      // 						face_id: id,
      // 						message: msg
      // 					},
      // 					success: function (res) {
      // 						console.log('已上传到对方message数据库中')

      // 					}
      // 				})

      // 		}
      // 	}

      // }






    })

  })
}


// 获取对方user数据库信息    get_face_user   246
const get_face_user = function(face_openid, resolve) {
  db.collection('user').where({
    _openid: face_openid
  }).get().then(res => {
    console.log('获取对方user成功', res)
    resolve(res)
  })
}


// 在chat页面，接受对方消息----从message数据库取出自己的msg，加载成可视化chat_visaul,保存到本地chat缓存       get_face_msg      257
const get_face_msg = function(user_openid, face_openid, that) {
  let c = 0
  var promise3 = new Promise(function(resolve, reject) {
    db.collection('message').where({
      _openid: user_openid
    }).get().then(res => {

      console.log('获取自己msg成功')
      resolve(res.data[0].msg)
    })
  })
  promise3.then(res => {
    var user_msg = res
    let promiseArr1 = []
    for (let j = 0; j < user_msg.length; j++) {
      if (face_openid === user_msg[j].face_openid) {
        console.log(909)
        for (let k = 0; k < user_msg[j].contant.length; k++) {
          console.log("user_msg[j].contant.length", user_msg[j].contant.length)
          promiseArr1.push(new Promise(function(resolve, reject) {
            console.log('j', j)
            console.log('k', k)
            console.log("c  ", c)
            c++
            make_chat('server', user_msg[j].contant[k], that, resolve, face_openid)
          }))
          
        }
        Promise.all(promiseArr1).then(res => {
          console.log('promiseArr1.length', promiseArr1.length)
          console.log('保存到本地缓存成功,可视化成功')
          // 清空云端未读
          


          user_msg[j].contant = []
          console.log('[]')
          db.collection('message').where({
            _openid: user_openid
          }).get().then(res => {

            if( res.data[0].msg[j].contant.length == 0){
              console.log('云端已被清空')
            }else{
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
            }

            
          })
        })
      }
    }
  })
}
/*
	app.中使用的方法
*/
// 获取自己的  message 中 msg，将不为[]的，统计总个数(length相加)，写入tabbar.count  每1s执行一次   get_noread_count  306
const get_noread_count = function(that) {
  var promise335 = new Promise(function(resolve, reject) {
    user_openid(resolve)
  }).then(res => {
    db.collection('message').where({
      _openid: res
    }).get().then(res => {
      // res.data[0].msg
      let m = 0
      for (let l = 0; l < res.data[0].msg.length; l++) {
        m = res.data[0].msg[l].contant.length + m
        if (l == res.data[0].msg.length - 1) {
          that.globalData.count = m
          return m
        }
      }
    })
  })

}
/*
	chatlist中使用的方法
*/
// 获取用户自身message列表-----Promise内使用，参数：用户openid，resolve



module.exports = {

  // 获取用户openid
  user_openid: user_openid, //js:5
  formattime:formattime,
  // 获取服务器时间
  yun_time: yun_time, //js:15

  // 新建用户个人信息到user
  add_user: add_user, //js:59

  // 新建用户聊天数据库message 
  add_message: add_message, //js:75

  // 通过商品id获取对方openid-----在Promise中执行，必须传入resolve 
  getOpenidByComodityId: getOpenidByComodityId, //js:90

  // 取出chatlist缓存----key = 'chatlist',,,
  getChatlistCache: getChatlistCache, //js:98

  // 保存chatlist缓存到本地----key = 'chatlist',contant = 数据    
  setChatlistCache: setChatlistCache, //js:112

  // 新建chatlist模板，并添加到chatlist本地缓存中（更新chatlist模板）---this.data.chatlist_visual
  make_chatlist: make_chatlist, //js:112

  // 取出chat缓存----key = 'chat'+openid 
  getChatCache: getChatCache, //js:180

  // 保存chat缓存----key = 'chat'+openid,contant = 数据  
  setChatCache: setChatCache, //js:179

  // 新建chat用户信息模板，并添加到chat本地缓存 ----写入this.data.chat_visual 
  make_chat: make_chat, //js:188

  // 获取对方message数据库信息，并向其写入自己发送的信息 
  write_face_message: write_face_message, //js:208

  // 获取对方user数据库信息    
  get_face_user: get_face_user, //js:246

  // 在chat页面，接受对方消息----从message数据库取出自己的msg，加载成可视化chat_visaul,保存到本地chat缓存     
  get_face_msg: get_face_msg, //js:257

  // 获取自己的  message 中 msg，将不为[]的，统计总个数(length相加)，写入tabbar.count  每1s执行一次  
  get_noread_count: get_noread_count, //js:306




 
  
}