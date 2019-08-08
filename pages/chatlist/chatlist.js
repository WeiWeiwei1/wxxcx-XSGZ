// pages/chatList/chatList.js
wx.cloud.init();
const db = wx.cloud.database();
var serverList = []
// 用于存本地聊天缓存
var servermsg = []
var yunmsg
var user_openid
const app = getApp()
var chat = require('../../utils/chat1.js')
var timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //{头像地址，用户名，最新消息，最新时间，未读消息数，是否隐藏未读消息数（隐藏为true）}
    serverList: [],
    user_openid: '',
    yunmsgData: '',
    goto: [],
    // tabbar
    active: 2,
    icon: {
      normal: '//img.yzcdn.cn/icon-normal.png',
      active: '//img.yzcdn.cn/icon-active.png'
    },
    count: ''
  },
  // tabbar
  onChange(event) {
    console.log(event.detail);
    var tabbarlist = app.globalData.tabbarlist
    wx.redirectTo({
      url: tabbarlist[event.detail]
    })
  },
  //获取本地缓存
  getPhoneData: function() {

  },
  //添加本地缓存
  putPhoneData: function() {
    //保存聊天数据到本地
    wx.setStorageSync('serverList', serverList)
  },
  //获取云数据并返回
  get_yunmsg: function() {
    wx.cloud.callFunction({
      name: 'getopenid',
      data: {},
      success: function(res) {
        db.collection('message').where({
          _openid: res.result.openid
        }).get().then(res => {
          console.log('以获取用户message云列表', res.data[0])

          return res.data[0]
        })
      }
    })
  },
  //	获取该openid的详细信息
  get_detail: function(openid) {
    db.collection('user').where({
      _openid: openid
    }).get().then(res => {
      return res.data[0]
    })
  },
  // 由详细信息制作集合  (openid的详细信息，该用户message 中openid的count数组)
  make_gather: function(gather, contant) {
    var that = this
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
  },
  //点击事件
  click_messge: function(options) {
    var that = this
    console.log(options.currentTarget.dataset.indexmsg)
    var click_index = options.currentTarget.dataset.indexmsg
    var click_chatlist = that.data.serverList
    click_chatlist[click_index].count = 0
    click_chatlist[click_index].lasts = ''
    click_chatlist[click_index].time = ''
    var click_tiplist = click_chatlist[click_index]
    var click_empty = []
    click_empty.push(click_tiplist)
    for (let i = 0; i < click_index; i++) {
      click_empty.push(click_chatlist[i])
    }
    for (let j = click_index + 1; j < click_chatlist.length; j++) {
      click_empty.push(click_chatlist[j])
    }
    that.setData({
      serverList: click_empty
    })
    wx.setStorage({
      key: 'chatlist',
      data: click_empty,
    })



    wx.navigateTo({
      url: '../chat/chat?openid=' + options.currentTarget.dataset.openid + '&contant=' + that.data.goto[0]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 第二次尝试
    // 初始化
    // 获取本地chatlist缓存
    function circle(){
      var chatlistcache
      var user_yunmsg
      var promise16 = new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'chatlist',
          success(res) {
            chatlistcache = res.data
            resolve(res.data)
          },
          fail(err) {
            chatlistcache = []
            resolve()
          }
        })
      })
      var promise18 = new Promise(function (resolve, reject) {
        db.collection('message').where({
          _openid: app.globalData.user_openid
        }).get().then(res => {
          user_yunmsg = res.data[0].msg
          resolve()
        })
      })
      Promise.all([promise16, promise18]).then(res => {
        console.log('获取 用户message.msg yunmsg', user_yunmsg)
        console.log('获取本地缓存成功 chatlistcache', chatlistcache)
        console.log('初始化成功')
        var promiseArr = []
        var you

        // 当contant.length>0时，写入promiseArr
        for (let i = 0; i < user_yunmsg.length; i++) {
          // 有新消息的写入或更新
          if (user_yunmsg[i].contant.length > 0) {
            promiseArr.push(new Promise(function (resolve, reject) {
              let tip_i
              let tip_j

              if (chatlistcache.length == 0) {
                // 本地缓存为空时，---直接获取对方信息，制作集合，写入chatlistcache，并置顶
                db.collection('message').where({
                  _openid: user_yunmsg[i].face_openid
                }).get().then(res => {
                  var empty1 = {
                    openid: res.data[0]._openid,
                    name: res.data[0].name,
                    count: user_yunmsg[i].contant.length,
                    avatarUrl: res.data[0].avatarUrl,
                    lasts: user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].s,
                    lasttime: chat.formattime(user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].time,'h:s') 
                  }
                  chatlistcache.unshift(empty1)
                  resolve()
                })
              } else {
                // 本地缓存不为空时
                // 查找本地列表中是否存在该openid
                for (let j = 0; j < chatlistcache.length; j++) {
                  // console.log('i,j',[i,j])
                  if (user_yunmsg[i].face_openid == chatlistcache[j].openid) {
                    you = true
                    console.log('i', i)
                    tip_i = i
                    tip_j = j
                  }
                }
                if (typeof tip_i == 'number') {
                  // 有
                  // 直接对该集合进行赋值
                  chatlistcache[tip_j].count = user_yunmsg[tip_i].contant.length
                  chatlistcache[tip_j].lasts = user_yunmsg[tip_i].contant[user_yunmsg[tip_i].contant.length - 1].s
                  chatlistcache[tip_j].lasttime = chat.formattime(user_yunmsg[tip_i].contant[user_yunmsg[tip_i].contant.length - 1].time,'h:s') 
                  // 置顶该集合
                  if (chatlistcache.length == 1) {
                    resolve()
                  } else {
                    let tip_list = chatlistcache[tip_j]
                    let emptylist = []
                    emptylist.unshift(tip_list)
                    for (let l = 0; l < tip_j; l++) {
                      emptylist.push(chatlistcache[l])
                    }
                    for (let m = tip_j + 1; m < chatlistcache.length; m++) {
                      emptylist.push(chatlistcache[m])
                    }
                    resolve()
                  }


                } else {
                  // 无
                  // 获取对方详细信息

                  console.log('tip_i', tip_i)
                  db.collection('message').where({
                    _openid: user_yunmsg[i].face_openid
                  }).get().then(res => {
                    let empty2 = {
                      openid: res.data[0]._openid,
                      name: res.data[0].name,
                      count: user_yunmsg[i].contant.length,
                      avatarUrl: res.data[0].avatarUrl,
                      lasts: user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].s,
                      lasttime: chat.formattime(user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].time,'h:s') 
                    }
                    chatlistcache.unshift(empty2)
                    resolve()
                  })
                }
              }
            }))
          }
        }
        Promise.all(promiseArr).then(res => {
          that.setData({
            serverList: chatlistcache
          })
          wx.setStorage({
            key: "chatlist",
            data: chatlistcache
          })
        })

      })
    }
    circle()
    timer = setInterval(function(){
      var chatlistcache
      var user_yunmsg
      var promise16 = new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'chatlist',
          success(res) {
            chatlistcache = res.data
            resolve(res.data)
          },
          fail(err) {
            chatlistcache = []
            resolve()
          }
        })
      })
      var promise18 = new Promise(function (resolve, reject) {
        db.collection('message').where({
          _openid: app.globalData.user_openid
        }).get().then(res => {
          user_yunmsg = res.data[0].msg
          resolve()
        })
      })
      Promise.all([promise16, promise18]).then(res => {
        console.log('获取 用户message.msg yunmsg', user_yunmsg)
        console.log('获取本地缓存成功 chatlistcache', chatlistcache)
        console.log('初始化成功')
        var promiseArr = []
        var you

        // 当contant.length>0时，写入promiseArr
        for (let i = 0; i < user_yunmsg.length; i++) {
          // 有新消息的写入或更新
          if (user_yunmsg[i].contant.length > 0) {
            promiseArr.push(new Promise(function (resolve, reject) {
              let tip_i
              let tip_j

              if (chatlistcache.length == 0) {
                // 本地缓存为空时，---直接获取对方信息，制作集合，写入chatlistcache，并置顶
                db.collection('message').where({
                  _openid: user_yunmsg[i].face_openid
                }).get().then(res => {
                  var empty1 = {
                    openid: res.data[0]._openid,
                    name: res.data[0].name,
                    count: user_yunmsg[i].contant.length,
                    avatarUrl: res.data[0].avatarUrl,
                    lasts: user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].s,
                    lasttime: chat.formattime(user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].time,'h:s')
                  }
                  chatlistcache.unshift(empty1)
                  resolve()
                })
              } else {
                // 本地缓存不为空时
                // 查找本地列表中是否存在该openid
                for (let j = 0; j < chatlistcache.length; j++) {
                  // console.log('i,j',[i,j])
                  if (user_yunmsg[i].face_openid == chatlistcache[j].openid) {
                    you = true
                    console.log('i', i)
                    tip_i = i
                    tip_j = j
                  }
                }
                if (typeof tip_i == 'number') {
                  // 有
                  // 直接对该集合进行赋值
                  chatlistcache[tip_j].count = user_yunmsg[tip_i].contant.length
                  chatlistcache[tip_j].lasts = user_yunmsg[tip_i].contant[user_yunmsg[tip_i].contant.length - 1].s
                  chatlistcache[tip_j].lasttime = chat.formattime(user_yunmsg[tip_i].contant[user_yunmsg[tip_i].contant.length - 1].time,'h:s') 
                  // 置顶该集合
                  if (chatlistcache.length == 1) {
                    resolve()
                  } else {
                    let tip_list = chatlistcache[tip_j]
                    let emptylist = []
                    emptylist.unshift(tip_list)
                    for (let l = 0; l < tip_j; l++) {
                      emptylist.push(chatlistcache[l])
                    }
                    for (let m = tip_j + 1; m < chatlistcache.length; m++) {
                      emptylist.push(chatlistcache[m])
                    }
                    resolve()
                  }


                } else {
                  // 无
                  // 获取对方详细信息

                  console.log('tip_i', tip_i)
                  db.collection('message').where({
                    _openid: user_yunmsg[i].face_openid
                  }).get().then(res => {
                    let empty2 = {
                      openid: res.data[0]._openid,
                      name: res.data[0].name,
                      count: user_yunmsg[i].contant.length,
                      avatarUrl: res.data[0].avatarUrl,
                      lasts: user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].s,
                      lasttime: chat.formattime(user_yunmsg[i].contant[user_yunmsg[i].contant.length - 1].time,'h:s') 
                    }
                    chatlistcache.unshift(empty2)
                    resolve()
                  })
                }
              }
            }))
          }
        }
        Promise.all(promiseArr).then(res => {
          that.setData({
            serverList: chatlistcache
          })
          wx.setStorage({
            key: "chatlist",
            data: chatlistcache
          })
        })

      })
    },5000)
    




    // 第一次尝试
    // 写入消息数
    // app.set_timer(that)
    // setInterval(function () {
    // 	that.setData({
    // 		count: app.globalData.count
    // 	})
    // }, 1000)
    // // 1.加载本地缓存 -- serverList
    // //that.getPhoneData()
    // var promise1 = new Promise(function (resolve, reject) {
    // 	serverList = wx.getStorageSync('serverList') || []
    // 	that.setData({
    // 		serverList: serverList
    // 	})
    // 	console.log('1234', serverList)
    // 	resolve()
    // })
    // // 2.获取云消息列表

    // // yunmsg = that.get_yunmsg()
    // // console.log(yunmsg)
    // var promise2 = new Promise(function (resolve, reject) {
    // 	wx.cloud.callFunction({
    // 		name: 'getopenid',
    // 		data: {},
    // 		success: function (res) {
    // 			that.setData({
    // 				user_openid: res.result.openid
    // 			})

    // 			db.collection('message').where({
    // 				_openid: res.result.openid
    // 			}).get().then(res => {
    // 				yunmsg = res.data[0]
    // 				console.log('1111', yunmsg)
    // 				var nn = yunmsg
    // 				that.setData({
    // 					yunmsgData: res.data[0]
    // 				})
    // 				// 遍历所有msg.contant  到 this.data.goto
    // 				var gotoNext = []
    // 				for (let b = 0; b < res.data[0].msg.length; b++) {
    // 					console.log('b', res.data[0].msg[b])
    // 					gotoNext.push(res.data[0].msg[b].contant)
    // 					if (b == res.data[0].msg.length - 1) {
    // 						console.log('gotoNext', gotoNext)
    // 						that.setData({
    // 							goto: gotoNext
    // 						})
    // 					}

    // 				}


    // 				// 将count不为空的，内容保存到相应的名为'chatData'+this.data.server_openid本地内存中
    // 				// 格式{speaker	:	server ,contentType: text,content: 可以开始聊天了}
    // 				// 1.查找不为空的contant
    // 				var promiseArr2 = []
    // 				for (let aa = 0; aa < nn.msg.length; aa++) {
    // 					if (nn.msg[aa].contant.length != 0) {
    // 						promiseArr2.push(new Promise(function (resolve, reject) {
    // 							// 初始化聊天内容，获取数据库中保存的内容，获取本地的内容
    // 							var server_openid = nn.msg[aa].face_openid
    // 							var msgList
    // 							console.log(typeof wx.getStorageSync('chatData' + server_openid))
    // 							if (typeof wx.getStorageSync('chatData' + server_openid) == 'string') {
    // 								msgList = []
    // 								// 放入对方消息
    // 								var promise2 = new Promise(function (resolve, reject) {
    // 									for (let bb = 0; bb < nn.msg[aa].contant.length; bb++) {
    // 										var emptychat = { speaker: 'server', contentType: 'text', content: nn.msg[aa].contant[bb].s }
    // 										msgList.push(emptychat)
    // 										if (bb == nn.msg[aa].contant.length - 1) {
    // 											console.log('121212', msgList)
    // 											resolve()
    // 										}
    // 									}
    // 								})
    // 								Promise.all([promise2]).then(function (res) {
    // 									//保存到本地
    // 									//wx.setStorageSync('chatData' + server_openid, msgList)
    // 									wx.setStorage({
    // 										key: 'chatData' + server_openid,
    // 										data: msgList
    // 									})
    // 									console.log('保存到本地完成')
    // 									resolve()
    // 								})
    // 							} else {
    // 								//msgList = wx.getStorageSync('chatData' + server_openid)
    // 								wx.getStorage({
    // 									key: 'chatData' + server_openid,
    // 									success(res) {
    // 										msgList = res.data
    // 										console.log("321", res.data)
    // 										// 放入对方消息
    // 										var promise2 = new Promise(function (resolve, reject) {
    // 											for (let bb = 0; bb < nn.msg[aa].contant.length; bb++) {
    // 												var emptychat = { speaker: 'server', contentType: 'text', content: nn.msg[aa].contant[bb].s }
    // 												msgList.push(emptychat)
    // 												if (bb == nn.msg[aa].contant.length - 1) {
    // 													console.log('121212', msgList)
    // 													resolve()
    // 												}
    // 											}
    // 										})
    // 										Promise.all([promise2]).then(function (res) {
    // 											//保存到本地
    // 											//wx.setStorageSync('chatData' + server_openid, msgList)
    // 											// wx.setStorage({
    // 											// 	key: 'chatData' + server_openid,
    // 											// 	data: msgList
    // 											// })
    // 											console.log('保存到本地完成')
    // 											resolve()
    // 										})

    // 									}
    // 								})
    // 								console.log('msglist')
    // 							}


    // 						}))
    // 					}
    // 				}
    // 				Promise.all(promiseArr2).then(function () {

    // 					resolve()
    // 				})



    // 				// 第二种方法 说明 ---将
    // 			})
    // 		}
    // 	})
    // })
    // //yunmsg中openid若在serverList没有，先对该openid用户信息获取，再制作该openid的集合，再添加到serverList首个，
    // // 若有，先对该openid用户信息获取，再制作该openid的集合，再删除原有的，把现在的添加到首个


    // var promise3 = new Promise(function (resolve, reject) {

    // })
    // Promise.all([promise1, promise2]).then(function () {
    // 	console.log('yun', yunmsg)
    // 	//	3.获取该openid的详细信息
    // 	var promiseArr = []
    // 	var face_detailslist = []
    // 	for (let j = 0; j < yunmsg.msg.length; j++) {
    // 		// that.get_detail(yunmsg.msg[j].face_openid)
    // 		promiseArr.push(new Promise(function (resolve, reject) {
    // 			db.collection('user').where({
    // 				_openid: yunmsg.msg[j].face_openid
    // 			}).get().then(res => {
    // 				face_detailslist.push(res.data[0])
    // 				resolve()
    // 			})
    // 		}))
    // 	}
    // 	Promise.all(promiseArr).then(function () {
    // 		console.log('face_detailslist', face_detailslist)
    // 		// 4.整理出可视化集合---
    // 		for (let k = 0; k < face_detailslist.length; k++) {
    // 			serverList.push(that.make_gather(face_detailslist[k], yunmsg.msg[k]))
    // 		}
    // 		console.log(serverList)
    // 		that.setData({
    // 			serverList: serverList
    // 		})
    // 	})

    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //转换时间戳为时间
  formattime: function(number, format) {
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

})