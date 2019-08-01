// pages/Commodity_page/commodity.js
// 获取程序实例
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
var tempFilePathsm = ''
//创建全局唯一录音管理器
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
//获取util.js
var util = require("../../utils/util.js")
var timeStart;
var timeEnd;

Page({
  // 设置宽高；功能：使其按比例压缩
  number: function(index, s) {
    if (s == "w") {
      if (this.data.whratio[index] > 1) {
        return 300
      } else {
        return 300 * this.data.whratio[index]
      }
    }
    if (s == "h") {
      if (this.data.whratio[index] > 1) {
        return 300 / this.data.whratio[index]
      } else {
        return 300
      }
    }
  },
  //选择图片并压缩图片
  chooseImage: function() {
    var that = this

    function runAsync() {
      var promise1 = new Promise((resolve, reject) => {
        that.setData({
          tempFilePath: [],
          imageW: [],
          imageH: [],
          imgFilePath: [],
          whratio: [], //宽>高比
        })
        wx.chooseImage({
          count: 3,
          success: function(resp) {
            if (resp.tempFilePaths.length != 3) {
              reject()
            } else {
              wx.showLoading({
                title: '开始压缩',
              })
              console.log(resp.tempFilePaths)
              that.setData({
                tempFilePath: resp.tempFilePaths
              })
              for (let i = 0; i < 3; i++) {
                wx.getImageInfo({
                  src: resp.tempFilePaths[i],
                  success(res) {
                    that.data.imageW.push(res.width)
                    that.data.imageH.push(res.height)
                    that.data.whratio.push(res.width / res.height)
                    if (i == 2) {
                      resolve()
                    }
                  }
                })
              }
            }
          }
        })
      })
      return promise1
    }
    runAsync().then(function() {
      var ctx_first = wx.createCanvasContext("myCanvas1")
      return new Promise((resolve, reject) => {
        ctx_first.drawImage(that.data.tempFilePath[0], 0, 0, that.data.imageW[0], that.data.imageH[0], 0, 0, that.number(0, "w"), that.number(0, "h"))
        ctx_first.draw(false, function() {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.number(0, "w"),
            height: that.number(0, "h"),
            destWidth: that.number(0, "w"),
            destHeight: that.number(0, "h"),
            canvasId: "myCanvas1",
            quality: 1,
            success(res) {
              console.log(res.tempFilePath, "yasuohou")
              that.setData({
                imgFilePath: that.data.imgFilePath.concat(res.tempFilePath)
              })
            }
          })
        })
        resolve()
      })
    }, function() {
      return new Promise((resolve, reject) => {
        wx.showToast({
          title: '请选择三张图片',
          icon: "none",
          duration: 2000
        })
        reject()
      })
    }).then(function() {
      var ctx_second = wx.createCanvasContext("myCanvas2")
      return new Promise((resolve, reject) => {
        ctx_second.drawImage(that.data.tempFilePath[1], 0, 0, that.data.imageW[1], that.data.imageH[1], 0, 0, that.number(1, "w"), that.number(1, "h"))
        ctx_second.draw(false, function() {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.number(1, "w"),
            height: that.number(1, "h"),
            destWidth: that.number(1, "w"),
            destHeight: that.number(1, "h"),
            canvasId: "myCanvas2",
            quality: 1,
            success(res) {
              that.setData({
                imgFilePath: that.data.imgFilePath.concat(res.tempFilePath)
              })
            }
          })
        })
        resolve()
      })
    }, function() {
      return new Promise((resolve, reject) => {
        reject()
      })
    }).then(
      function() {
        var ctx_third = wx.createCanvasContext("myCanvas3")
        return new Promise((resolve, reject) => {
          ctx_third.drawImage(that.data.tempFilePath[2], 0, 0, that.data.imageW[2], that.data.imageH[2], 0, 0, that.number(2, "w"), that.number(2, "h"))
          ctx_third.draw(false, function() {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: that.number(2, "w"),
              height: that.number(2, "h"),
              destWidth: that.number(2, "w"),
              destHeight: that.number(2, "h"),
              canvasId: "myCanvas3",
              quality: 1,
              success(res) {
                that.setData({
                  imgFilePath: that.data.imgFilePath.concat(res.tempFilePath)
                })
                wx.hideLoading()
                wx.showToast({
                  title: '压缩完成',
                })
                that.setData({
                  show_photo: true
                })
              }
            })
          })
          resolve()
        })
      }
    )
  },

  // uploadimg: function() {
  //   var that = this
  //   // 让用户选择三张图片
  //   wx.chooseImage({
  //     count: 3,
  //     tempFilePaths: ['one.jpg', 'two.jpg', 'tree.jpg'],
  //     success: chooseResult => {
  //       // 将选中图片的临时路径保存到this.data中
  //       console.log("图片临时文件路径", chooseResult.tempFilePaths)
  //       // if (chooseResult.tempFiles[0].size < 2000000){
  //       //   if (chooseResult.tempFiles[1].size < 2000000){
  //       //     if (chooseResult.tempFiles[2].size < 2000000){

  //       //       that.setData({
  //       //         tempFilePath: chooseResult.tempFilePaths,
  //       //         show_photo: true,
  //       //       })
  //       //     }
  //       //     else{
  //       //       wx.showToast({
  //       //         title: '上传图片不能大于2M!',  //标题
  //       //         icon: 'none'       //图标 none不使用图标，详情看官方文档
  //       //       })
  //       //     }
  //       //   }
  //       //   else{
  //       //     wx.showToast({
  //       //       title: '上传图片不能大于2M!',  //标题
  //       //       icon: 'none'       //图标 none不使用图标，详情看官方文档
  //       //     })
  //       //   }
  //       // }
  //       // else{
  //       //   wx.showToast({
  //       //     title: '上传图片不能大于2M!',  //标题
  //       //     icon: 'none'       //图标 none不使用图标，详情看官方文档
  //       //   })

  //       // }
  //       const ctx = wx.createCanvasContext("compress-image")
  //       for(var i = 0;i<3;i++){
  //         ctx.drawImage(chooseResult.tempFilePaths[i], 0, 0, chooseResult.tempFilePaths[i].width, chooseResult.tempFilePaths[i].height, 0, 0, chooseResult.tempFilePaths[i].width / 5, chooseResult.tempFilePaths[i].height/5)
  //         ctx.draw(true,function(){
  //           wx.canvasToTempFilePath({
  //             x: 0,
  //             y: 0,
  //             // width: chooseResult.tempFilePaths[i].width / 5,
  //             // height: chooseResult.tempFilePaths[i].height / 5,
  //             // destWidth: chooseResult.tempFilePaths[i].width / 5,
  //             // destHeight: chooseResult.tempFilePaths[i].height / 5,
  //             canvasId: "compress-image",
  //             quality: 1,
  //             success(res) {
  //               that.data.tempFilePath.push(res.tempFilePath)
  //               if (i == 2) {
  //                 that.setData({
  //                   show_photo: true
  //                 })
  //               }
  //             }
  //           })
  //         })
  //          wx.saveImageToPhotosAlbum({
  //         filePath: that.data.tempFilePath[i],
  //         success: function () {
  //           console.log("保存成功")
  //         }
  //       })

  //       }

  //     },
  //   })

  // },

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePath: [], //选择图片临时路径
    imageW: [],
    imageH: [],
    imgFilePath: [], //压缩后图片临时路径
    whratio: [], //宽>高比
    //显示上传图片页面
    uploadView: 1,
    // 商品价格
    price: '',
    // 商品分类
    category: ["考研图书", '手机', '电脑', "数码", "配件", '家用电器', '玩具乐器', '图书文娱', '生活旅行', "游戏", ["其它"]],
    // 图书分类
    book: [
      ["机械工程学院", "动物科学学院", "电气与电子工程学院", "财经学院", "农学院", "建筑学院", "化学与材料工程学院", "管理学院", "生命健康科学院", "信息与网络工程学院", "食品工程学院", "外国语学院", "资源与环境学院", "其它"],
      ["华为", "小米", "荣耀", "OPPO", "vivo", "纽曼", "魅族", "苹果", "美图", "锤子", "360", "三星", "努比亚", "金立", "天语", "其它"],
      ["笔记本电脑", "平板电脑", "DIY电脑", "台式机", "电脑硬件", "液晶显示屏", "鼠标", "键盘", "鼠键套装"],
      ["数码相机", "微单", "单反相机", "镜头", "摄像机", "音响音响", "机顶盒", "智能穿戴", "麦克风", "其它"],
      ["手机配件", "电脑配件", "耳机", "移动电源", "U盘", "相机配件", "移动硬盘", "光碟", "其它"],
      ["电吹风", "电水壶", "电热毯", "饮水机", "剃须刀", "按摩仪", "豆浆机", "榨汁机", "面包机", "扫地机器人", "干鞋机", "加湿器", "挂烫机", "干衣机", "毛球修剪器", "其它"],
      ["钢琴", "数码钢琴", "电子琴", "吉他", "大小提琴", "三弦", "萨克斯", "单簧管", "笛子", "萧", "口琴", "鼓", "古筝", "琵琶", "架谱", "二胡", "其它"],
      ['文学小说', '人文社科', '经管励志', '艺术', 'IT科技', '文娱', '生活', "教育工具书", "其它"],
      ["户外攀岩", "户外露营", "户外配饰", "运动瑜伽", "运动服饰", "五金工具", "二手车", "其它"],
      ["英雄联盟","绝地求生", "王者荣耀","和平精英", "碧蓝航线", "阴阳师", "鬼泣", "怪物猎人", "侠盗飞车", "明日方舟", "明日之后", "QQ飞车", "fgo", "其它"],
      []
    ],
    // 图书类显示
    bookshow: 0,
    commodity: '',
    // 商品为图书类时数据
    bookCategory: '',
    // 录音文件临时路径
    recordFils: [],
    // 商品标题
    product_title: '',
    //商品详述
    product_description: '',
    // 选择的分类
    input_category: "",
    //云内容
    time: 15,
    timer: '',
    show_playRecord: 0,
    // 显示图片预览
    show_photo: false,
    // 图片样式
    swiper_image: ["swiper_image1", "swiper_image2", "swiper_image3"],
    // 图片在储存器中的地址（不是链接）
    cloudImage: [],
    _openid: "",
    //该用户商品个数
    num: 0,
    record_path: "",
    // 录音文件云储存中fileID
    record_fileID: [],
    // 图片文件云储存中的fileID
    image_fileID: [],
    // 判断是否上传数据
    data_num: 0,
    // 注册定时器以一秒为周期
    data_setInterval: "",
    // 弹出分类窗口
    mHidden: true,
    //分类内容
    classified_content_first: 0,
    classified_content_second: 0,
    classified_content: "无",
    select_class: 0,
    // 显示第二级分类
    show_second: 0,
		// 相机页数据
		srcFirst: "",
		srcSecond: "",
		srcThird: "",
  },
	// 跳转相机页
	goTocamera:function(){
		// wx.redirectTo({
		// 	url: '../camera/camera?title=' + this.data.title + '&detail=' + this.data.detail + '&classified_content=' + this.data.classified_content + '&classified_content_first=' + this.data.classified_content_first + '&classified_content_second=' + this.data.classified_content_second + '&price=' + this.data.price + '&record_fileID=' + this.data.record_fileID + '&recordFils=' + this.data.recordFils
		// })
		wx.navigateTo({
			url:'../camera/camera'
		})
	},
  // 显示分类modal
  change_modal: function() {
    var that = this
    this.setData({
      mHidden: !that.data.mHidden,
      classified_content: that.data.category[that.data.classified_content_first] + "/" + that.data.book[that.data.classified_content_first][that.data.classified_content_second]
    })
  },
  // 显示第二级分类
  bindChange: function(e) {
    var that = this
    console.log(e.detail.value[0])
    const val = e.detail.value
    that.setData({
      show_second: val[0]
    })

    that.setData({
      classified_content_first: val[0],
      classified_content_second: val[1]
    })
    console.log[that.data.classified_content]
  },
  // 显示图书类
  bookShow: function(e) {
    const val = e.detail.value
    this.setData({
      commodity: val[0],
      bookCategory: val[1]
    })
    this.setData({
      classified_content_first: val[0],
      classified_content_second: val[1],
    })
  },
  bindChange_two: function(e) {
    var that = this
    this.setData({
      classified_content_all: that.data.classified_content_first + "/" + that.data.book[e.detail.value]
    })
  },
  // 向this.data中写入商品标题
  bindTitleInput: function(e) {
    this.setData({
      inputTitle: e.detail.value
    })
  },
  // 向this.data中写入商品价格
  bindPriceInput: function(e) {
    this.setData({
      inputPrice: e.detail.value
    })
  },
  //进行录音,15s自动关闭
  record: function() {

    //创建录音属性配置
    const options = {
      duration: 600000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    //开始录音，并打印log
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    // 获取时间
    timeEnd = Date.parse(new Date()) / 1000;
    // 延时15s停止播放
    setTimeout(
      function() {
        recorderManager.stop()
        recorderManager.onStop((res) => {
          tempFilePathsm = res.tempFilePath
          console.log('停止录音', res.tempFilePath)
          const {
            tempFilePath
          } = res
        })
      }, 15000);
    let that = this;
    // 写入剩余时间
    that.setData({
      timer: setInterval(function() {
        let seconds = that.data.time
        that.setData({
          time: seconds - 1
        })
        if (that.data.time == 0) {
          // 读秒结束 清空计时器
          clearInterval(that.data.timer)
        }
      }, 1000)
    })
  },
  // 结束录音函数调用
  stopRecord: function() {
    var that = this
    recorderManager.stop()
    recorderManager.onStop((res) => {
      that.setData({
        // recordFils:arry
        recordFils: res.tempFilePath
      })
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
    })
  },
  // 录音时间提醒
  touchStart: function(e) {
    var that = this
    console.log("Start", e)
    // 获取开始时间
    timeStart = Date.parse(new Date()) / 1000;
  },
  touchEnd: function(e) {
    var that = this
    var arry = []
    console.log("End", e)
    // 停止录音
    recorderManager.stop()
    recorderManager.onStop((res) => {
      tempFilePathsm = res.tempFilePath
      arry.push(res.tempFilePath)
      that.setData({
        recordFils: arry
      })
      console.log('停止录音', res.tempFilePath)
      const {
        tempFilePath
      } = res
    });
    // 清空计时器
    clearInterval(this.data.timer)
    this.setData({
      time: 15,
      show_playRecord: 1
    })
  },

  // 播放录音函数定义
  playRecord: function() {
    // const InnerAudioContext = wx.createInnerAudioContext()
    // InnerAudioContext.src = this.data.recordFils
    // InnerAudioContext.play()

    innerAudioContext.src = tempFilePathsm,
      innerAudioContext.seek(this.data.playRecord)
    innerAudioContext.play()
  },
  // 获取用户输入商品详述内容，并放入product_description中
  bindTextInput: function(e) {
    this.setData({
      product_description: e.detail.value
    })
  },
  // 第三次尝试上传所有信息
  uploadAll: function() {
    // 显示提醒
    var that = this
    // 建立提示promise
    var promise1 = new Promise((resolve, reject) => {
      if (that.data.product_title == "") {
        wx.showToast({
          title: '请填写商品标题',
          icon: "none",
          duration: 2000
        })
        reject()
      } else {
        if (that.data.product_description == "") {
          wx.showToast({
            title: '请填写商品详细信息',
            icon: "none",
            duration: 2000
          })
          reject()
        } else {
          if (that.data.price == "") {
            wx.showToast({
              title: '请填写商品价格',
              icon: "none",
              duration: 2000
            })
            reject()
          } else {
            if (that.data.classified_content == "无") {
              wx.showToast({
                title: '请选择商品分类',
                icon: "none",
                duration: 2000
              })
              reject()
            } else {
              // if (that.data.tempFilePath.length != 3) {
							if(app.globalData.used ==1){  
                wx.showToast({
                  title: '请拍摄商品图片',
                  icon: "none",
                  duration: 2000
                })
                reject()
              }
            }
          }
        }
      }
      // 提示输入信息
      resolve()
    })

    function runAysc1() {
      return promise1
    }
    runAysc1().then(function() {
      // 上传录音
      return new Promise((resolve, reject) => {
        if (that.data.recordFils.length == 1) {
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: "commodity_information/" + that.data._openid + "/" + that.data.num + "/luyin.mp3",
            // 指定要上传的文件的小程序临时文件路径
            filePath: that.data.recordFils[0],
            // 成功回调
            success: res => {
              that.data.record_fileID.push(res.fileID)
              resolve()
              console.log("tempFilePathsm", tempFilePathsm)
              console.log("录音上传成功，录音fileID", res.fileID)
            },
            fail: err => {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    }).then(
      function() {
        wx.showLoading({
          title: '正在上传'
        }) //上传第一张图
        var promise2 = new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: that.data.cloudImage[0],
            // filePath: that.data.imgFilePath[0], // 文件路径
						filePath: that.data.srcFirst,
            success: res => {
              // get resource ID
              that.data.image_fileID.push(res.fileID)
              resolve()
              console.log("图片fileID0", res.fileID)
              this.setData({
                uploadView: 1
              })
              console.log("图片上传成功0")

            },
            fail: err => {
              reject("图片上传失败0")
            }
          })
        })
        return promise2
      }).then(function() {
      // 上传第二张图片
      return new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: that.data.cloudImage[1],
          //filePath: that.data.imgFilePath[1], // 文件路径
					filePath: that.data.srcSecond,
          success: res => {
            // get resource ID
            that.data.image_fileID.push(res.fileID)
            resolve()
            console.log("图片fileID1", res.fileID)
            this.setData({
              uploadView: 1
            })
            console.log("图片上传成功1")

          },
          fail: err => {
            reject("图片上传失败1")
          }
        })
      })
    }).then(function() {
      // 上传第三章图片
      return new Promise(((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: that.data.cloudImage[2],
          //filePath: that.data.imgFilePath[2], // 文件路径
					filePath: that.data.srcThird,
          success: res => {
            // get resource ID
            that.data.image_fileID.push(res.fileID)
            resolve()
            console.log("图片fileID2", res.fileID)
            this.setData({
              uploadView: 1
            })
            console.log("图片上传成功2")

          },
          fail: err => {
            reject("图片上传失败2")
          }
        })
      }))
    }).then(function() {
      return new Promise((resolve, reject) => {
        // 上传数据库
        wx.cloud.callFunction({
          // 云函数名称
          name: 'add',
          // 传给云函数的参数
          data: {
            // 商品标题
            product_title: that.data.product_title,
            //商品详述
            product_description: that.data.product_description,
            // 价格
            prise: that.data.price,
            // 分类
            input_category: that.data.classified_content,
            // 第几个商品（从0开始）
            num: that.data.num,
            // 云储存中图片fileID
            image_fileID: that.data.image_fileID,
            // 云储存中录音文件fileID
            record_fileID: that.data.record_fileID
          },
          success(res) {
            resolve()
            console.log("数据库上传成功")

          },
          fail: err => {
            reject()
            console.log("数据库上传失败")

          }
        })
      })
    }).then(function() {
      wx.hideLoading({
        success(res) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 2000
          })
        }
      }, 2000)
			app.globalData.srcFirst = ""
			app.globalData.srcSecond = ""
			app.globalData.srcThird = ""
			app.globalData.used = 1
			wx.reLaunch({
        url: '../Home_page/home'
      })
    })
  },
  // 上传商品所有信息
  // uploadAll: function() {
  //   var that = this
  //   // 建立提示promise
  //   var promise1 = new Promise((resolve, reject) => {
  //     if (that.data.product_title == "") {
  //       wx.showToast({
  //         title: '请填写商品标题',
  //         icon: "none",
  //         duration: 2000
  //       })
  //       reject()
  //     } else {
  //       if (that.data.product_description == "") {
  //         wx.showToast({
  //           title: '请填写商品详细信息',
  //           icon: "none",
  //           duration: 2000
  //         })
  //         reject()
  //       } else {
  //         if (that.data.price == "") {
  //           wx.showToast({
  //             title: '请填写商品价格',
  //             icon: "none",
  //             duration: 2000
  //           })
  //           reject()
  //         } else {
  //           if (that.data.classified_content == "无") {
  //             wx.showToast({
  //               title: '请选择商品分类',
  //               icon: "none",
  //               duration: 2000
  //             })
  //             reject()
  //           } else {
  //             if (that.data.tempFilePath.length != 3) {
  //               wx.showToast({
  //                 title: '请选择三张图片',
  //                 icon: "none",
  //                 duration: 2000
  //               })
  //               reject()
  //             }
  //           }
  //         }
  //       }
  //     }
  //     // 提示输入信息
  //     resolve()
  //   })

  //   function runAysc1() {
  //     return promise1
  //   }
  //   runAysc1().then(
  //     function() {
  //       wx.showLoading({
  //         title: '正在上传'
  //       }) //上传第一张图
  //       var promise2 = new Promise((resolve, reject) => {
  //         wx.cloud.uploadFile({
  //           cloudPath: that.data.cloudImage[0],
  //           filePath: that.data.imgFilePath[0], // 文件路径
  //           success: res => {
  //             // get resource ID
  //             that.data.image_fileID.push(res.fileID)
  // 						resolve()
  //             console.log("图片fileID0", res.fileID)
  //             this.setData({
  //               uploadView: 1
  //             })
  //             console.log("图片上传成功0")

  //           },
  //           fail: err => {
  //             reject("图片上传失败0")
  //           }
  //         })
  //       })
  //       return promise2
  //     }).then(function() {
  //     // 上传第二张图片
  //     return new Promise((resolve, reject) => {
  //       wx.cloud.uploadFile({
  //         cloudPath: that.data.cloudImage[1],
  //         filePath: that.data.imgFilePath[1], // 文件路径
  //         success: res => {
  //           // get resource ID
  //           that.data.image_fileID.push(res.fileID)
  // 					resolve()
  //           console.log("图片fileID1", res.fileID)
  //           this.setData({
  //             uploadView: 1
  //           })
  //           console.log("图片上传成功1")

  //         },
  //         fail: err => {
  //           reject("图片上传失败1")
  //         }
  //       })
  //     })
  //   }).then(function() {
  //     // 上传第三章图片
  //     return new Promise(((resolve, reject) => {
  //       wx.cloud.uploadFile({
  //         cloudPath: that.data.cloudImage[2],
  //         filePath: that.data.imgFilePath[2], // 文件路径
  //         success: res => {
  //           // get resource ID
  //           that.data.image_fileID.push(res.fileID)
  // 					// if (that.data.recordFils.length == 1) {
  // 						wx.cloud.uploadFile({
  // 							// 指定上传到的云路径
  // 							cloudPath: "commodity_information/" + that.data._openid + "/" + that.data.num + "/luyin.mp3",
  // 							// 指定要上传的文件的小程序临时文件路径
  // 							filePath: that.data.recordFils,
  // 							// 成功回调
  // 							success: res => {
  // 								that.data.record_fileID.push(res.fileID)
  // 								resolve()
  // 								console.log("tempFilePathsm", tempFilePathsm)
  // 								console.log("录音上传成功，录音fileID", res.fileID)
  // 							},
  // 							fail:err=>{
  // 								resolve()
  // 							}
  // 						})
  // 					// } else {
  // 						// resolve()
  // 					// }
  //           console.log("图片fileID2", res.fileID)
  //           this.setData({
  //             uploadView: 1
  //           })
  //           console.log("图片上传成功2")

  //         },
  //         fail: err => {
  //           reject("图片上传失败2")
  //         }
  //       })
  //     }))
  //   }).then(function() {
  //     return new Promise((resolve, reject) => {
  //       // 上传录音

  //     })
  //   }).then(function(){
  // 		return new Promise((resolve,reject)=>{
  // 			       // 上传数据库
  //         wx.cloud.callFunction({
  //           // 云函数名称
  //           name: 'add',
  //           // 传给云函数的参数
  //           data: {
  //             // 商品标题
  //             product_title: that.data.product_title,
  //             //商品详述
  //             product_description: that.data.product_description,
  //             // 价格
  //             prise: that.data.price,
  //             // 分类
  //             input_category: that.data.classified_content,
  //             // 第几个商品（从0开始）
  //             num: that.data.num,
  //             // 云储存中图片fileID
  //             image_fileID: that.data.image_fileID,
  //             // 云储存中录音文件fileID
  //             record_fileID: that.data.record_fileID
  //           },
  //           success(res) {
  // 						resolve()
  //             console.log("数据库上传成功")

  //           },
  //           fail: err => {
  // 						reject()
  //             console.log("数据库上传失败")

  //           }
  //         })
  // 		})
  // 	}).then(function(){
  // 		wx.hideLoading()
  // 		wx.showToast({
  // 			title: '上传成功',
  // 			icon:"success",
  // 			duration:2000
  // 		})
  // 	})




  // 上传三张图片到云储存
  // var promise2 = new Promise((resolve, reject) => {
  //   wx.cloud.uploadFile({
  //     cloudPath: that.data.cloudImage[0],
  //     filePath: that.data.imgFilePath[0], // 文件路径
  //     success: res => {
  //       // get resource ID
  //       that.data.image_fileID.push(res.fileID)
  //       console.log("图片fileID1", res.fileID)
  //       this.setData({
  //         uploadView: 1
  //       })
  //       console.log("图片上传成功" + 1)
  //       resolve()
  //     },
  //     fail: err => {
  //       reject("图片1上传失败")
  //     }
  //   })
  // })
  // var promise3 = new Promise((resolve, reject) => {
  //   wx.cloud.uploadFile({
  //     cloudPath: that.data.cloudImage[1],
  //     filePath: that.data.imgFilePath[1], // 文件路径
  //     success: res => {
  //       // get resource ID
  //       that.data.image_fileID.push(res.fileID)
  //       console.log("图片fileID2", res.fileID)
  //       this.setData({
  //         uploadView: 1
  //       })
  //       console.log("图片上传成功" + 2)
  //       resolve()
  //     },
  //     fail: err => {
  //       console.log("图片2上传失败")
  //       reject()
  //     }
  //   })
  // })
  // var promise4 = new Promise((resolve, reject) => {
  //   wx.cloud.uploadFile({
  //     cloudPath: that.data.cloudImage[2],
  //     filePath: that.data.imgFilePath[2], // 文件路径
  //     success: res => {
  //       // get resource ID
  //       that.data.image_fileID.push(res.fileID)
  //       console.log("图片fileID3", res.fileID)
  //       this.setData({
  //         uploadView: 1
  //       })
  //       console.log("图片上传成功" + 3)
  //       resolve()
  //     },
  //     fail: err => {
  //       reject()
  //     }
  //   })
  // })
  //   Promise.all(promiseArr).then(function() {
  //     console.log("执行到recordFils.length上")
  //     // 上传录音
  //     if (that.data.recordFils.length == 1) {
  //       var promise5 = new Promise((resolve, reject) => {
  //         wx.cloud.uploadFile({
  //           // 指定上传到的云路径
  //           cloudPath: "commodity_information/" + that.data._openid + "/" + that.data.num + "/luyin.mp3",
  //           // 指定要上传的文件的小程序临时文件路径
  //           filePath: that.data.recordFils,
  //           // 成功回调
  //           success: res => {
  //             console.log("tempFilePathsm", tempFilePathsm)
  //             that.data.record_fileID.push(res.fileID)
  //             console.log("录音上传成功，录音fileID", res.fileID)
  //             resolve()
  //           }
  //         })
  //       })
  //       return promise5
  //     } else {
  //       return new Promise((resolve, reject) => {
  //         resolve()
  //       })
  //     }
  //   }).then(function() {
  //     var promise6 = new Promise((resolve, reject) => {
  //       // 上传数据库
  //       wx.cloud.callFunction({
  //         // 云函数名称
  //         name: 'add',
  //         // 传给云函数的参数
  //         data: {
  //           // 商品标题
  //           product_title: that.data.product_title,
  //           //商品详述
  //           product_description: that.data.product_description,
  //           // 价格
  //           prise: that.data.price,
  //           // 分类
  //           input_category: that.data.classified_content,
  //           // 第几个商品（从0开始）
  //           num: that.data.num,
  //           // 云储存中图片fileID
  //           image_fileID: that.data.image_fileID,
  //           // 云储存中录音文件fileID
  //           record_fileID: that.data.record_fileID
  //         },
  //         success(res) {
  //           console.log("数据库上传成功")
  //           resolve()
  //         },
  //         fail: err => {
  //           console.log("数据库上传失败")
  //           reject()
  //         }
  //       })
  //     })
  //     return promise6
  //   }).then(function() {
  // 		wx.hideLoading()
  //     wx.showToast({
  //       title: '上传成功',
  //     })
  //   }, function() {
  //     wx.showToast({
  //       title: '上传失败，请重试！',
  //     })
  //   })
  // })
  // },

  // 上传商品所有商品到云端
  // uploadAll: function() {
  //   var that = this
  //   if(that.data.product_title==""){
  //     wx.showToast({
  //       title: '请填写商品标题',
  //       icon: "none",
  //       duration: 2000
  //     })
  //   }
  //   else{
  //     if(that.data.product_description==""){
  //       wx.showToast({
  //         title: '请填写商品详细信息',
  //         icon: "none",
  //         duration: 2000
  //       })
  //     }
  //     else{
  //   if (that.data.price=="")
  //   {
  //     wx.showToast({
  //       title: '请填写商品价格',
  //       icon: "none",
  //       duration: 2000
  //     })
  //   }
  //   else{
  //   if (that.data.classified_content == "无") {
  //     wx.showToast({
  //       title: '请选择商品分类',
  //       icon:"none",
  //       duration: 2000
  //     })
  //   }
  //   else{
  //   wx.showLoading({
  //     title: '上传中'
  //   })

  //   if (that.data.recordFils.length == 1){
  //      wx.cloud.uploadFile({
  //     // 指定上传到的云路径
  //       cloudPath: "commodity_information/" + that.data._openid + "/" + that.data.num + "/luyin.mp3",
  //       // 指定要上传的文件的小程序临时文件路径
  //       filePath: that.data.recordFils,
  //       // 成功回调
  //       success: res => {
  //         console.log("tempFilePathsm", tempFilePathsm)
  //         that.data.record_fileID.push(res.fileID)
  //         console.log("录音上传成功，录音fileID", res.fileID)
  //         if (that.data.tempFilePath.length == 3){
  //             wx.cloud.uploadFile({
  //               cloudPath: that.data.cloudImage[0],
  //               filePath: that.data.imgFilePath[0], // 文件路径
  //               success: res => {
  //                 // get resource ID
  //                 that.data.image_fileID.push(res.fileID)
  //                 console.log("图片fileID1", res.fileID)
  //                 this.setData({
  //                   uploadView: 1
  //                 })
  //                 console.log("图片上传成功" + 1)
  //                 wx.cloud.uploadFile({
  //                   cloudPath: that.data.cloudImage[1],
  // 									filePath: that.data.imgFilePath[1], // 文件路径
  //                   success: res => {
  //                     // get resource ID
  //                     that.data.image_fileID.push(res.fileID)
  //                     console.log("图片fileID2", res.fileID)
  //                     this.setData({
  //                       uploadView: 1
  //                     })
  //                     console.log("图片上传成功" + 2)
  //                     wx.cloud.uploadFile({
  //                       cloudPath: that.data.cloudImage[2],
  // 											filePath: that.data.imgFilePath[2], // 文件路径
  //                       success: res => {
  //                         // get resource ID
  //                         that.data.image_fileID.push(res.fileID)
  //                         console.log("图片fileID3", res.fileID)
  //                         this.setData({
  //                           uploadView: 1
  //                         })
  //                         console.log("图片上传成功" +3)
  //                         // 上传数据库
  //                           wx.cloud.callFunction({
  //                             // 云函数名称
  //                             name: 'add',
  //                             // 传给云函数的参数
  //                             data: {
  //                               // 商品标题
  //                               product_title: that.data.product_title,
  //                               //商品详述
  //                               product_description: that.data.product_description,
  //                               // 价格
  //                               prise: that.data.price,
  //                               // 分类
  //                               input_category: that.data.classified_content,
  //                               // 第几个商品（从0开始）
  //                               num: that.data.num,
  //                               // 云储存中图片fileID
  //                               image_fileID: that.data.image_fileID,
  //                               // 云储存中录音文件fileID
  //                               record_fileID: that.data.record_fileID
  //                             },
  //                             success(res) {
  //                               console.log("数据库上传成功")

  //                               wx.hideLoading({
  //                                 success(res) {
  //                                   wx.showToast({
  //                                     title: '上传成功',
  //                                     icon: 'success',
  //                                     duration: 2000
  //                                   })
  //                                 }
  //                               }, 2000)
  //                               wx.switchTab({
  //                                 url: '../Home_page/home'
  //                               })
  //                             },
  //                             fail(err) { console.error }
  //                           })
  //                       },
  //                       fail(err) {
  //                         console.log(err)
  //                       }
  //                     })
  //                   },
  //                   fail(err) {
  //                     console.log(err)
  //                   }
  //                 })
  //               },
  //               fail(err) {
  //                 console.log(err)
  //               }
  //             })

  //         }
  //         else{
  //           wx.showToast({
  //               title: '请上传三张图片',
  //               icon: 'none',
  //               duration: 2000
  //             })
  //           }
  //         },
  //       fail: err => {
  //         console.log("录音上传失败", err)
  //       }
  //     })
  //   }
  //   else{
  //     if (that.data.imgFilePath.length == 3) {
  //       wx.cloud.uploadFile({
  //         cloudPath: that.data.cloudImage[0],
  //         filePath: that.data.imgFilePath[0], // 文件路径
  //         success: res => {
  //           // get resource ID
  //           that.data.image_fileID.push(res.fileID)
  //           console.log("图片fileID1", res.fileID)
  //           this.setData({
  //             uploadView: 1
  //           })
  //           console.log("图片上传成功" + 1)
  //           wx.cloud.uploadFile({
  //             cloudPath: that.data.cloudImage[1],
  //             filePath: that.data.imgFilePath[1], // 文件路径
  //             success: res => {
  //               // get resource ID
  //               that.data.image_fileID.push(res.fileID)
  //               console.log("图片fileID2", res.fileID)
  //               this.setData({
  //                 uploadView: 1
  //               })
  //               console.log("图片上传成功" + 2)
  //               wx.cloud.uploadFile({
  //                 cloudPath: that.data.cloudImage[2],
  //                 filePath: that.data.imgFilePath[2], // 文件路径
  //                 success: res => {
  //                   // get resource ID
  //                   that.data.image_fileID.push(res.fileID)
  //                   console.log("图片fileID3", res.fileID)
  //                   this.setData({
  //                     uploadView: 1
  //                   })
  //                   console.log("图片上传成功" + 3)
  //                   // 上传数据库
  //                   wx.cloud.callFunction({
  //                     // 云函数名称
  //                     name: 'add',
  //                     // 传给云函数的参数
  //                     data: {
  //                       // 商品标题
  //                       product_title: that.data.product_title,
  //                       //商品详述
  //                       product_description: that.data.product_description,
  //                       // 价格
  //                       prise: that.data.price,
  //                       // 分类
  //                       input_category: that.data.input_category,
  //                       // 第几个商品（从0开始）
  //                       num: that.data.num,
  //                       // 云储存中图片fileID
  //                       image_fileID: that.data.image_fileID,
  //                       // 云储存中录音文件fileID
  //                       record_fileID: that.data.record_fileID
  //                     },
  //                     success(res) {
  //                       console.log("数据库上传成功")

  //                       wx.hideLoading({
  //                         success(res) {
  //                           wx.showToast({
  //                             title: '上传成功',
  //                             icon: 'success',
  //                             duration: 2000
  //                           })
  //                         }
  //                       }, 2000)
  //                       wx.switchTab({
  //                         url: '../Home_page/home'
  //                       })
  //                     },
  //                     fail(err) { console.error }
  //                   })
  //                 },
  //                 fail(err) {
  //                   console.log(err)
  //                 }
  //               })
  //             },
  //             fail(err) {
  //               console.log(err)
  //             }
  //           })
  //         },
  //         fail(err) {
  //           console.log(err)
  //         }
  //       })

  //     }
  //     else {
  //       wx.showToast({
  //         title: '请上传三张图片',
  //         icon: 'none',
  //         duration: 2000
  //       })
  //     }
  //   }
  //   }
  //   }
  //   }
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 获取数据库中该用户商品个数
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getopenid',
      // 传给云函数的参数
      data: {},
      success(res) {
        console.log("调用getopenid成功", res) // 3
        console.log(res.result.event.userInfo.openId)
        that.setData({
          _openid: String(res.result.event.userInfo.openId)
        })
        setTimeout(function() {
          db.collection('comodity').where({
            openid: that.data._openid,
          }).get({
            success(res) {
              // res.data 是包含以上定义的两条记录的数组
              console.log("包含openid的res", res)
              console.log("包含openid的res.data", res.data)
              that.setData({
                num: res.data.length
              })
              setTimeout(function() {
                var id = that.data._openid
                console.log("id", id)
                // 制作图片云存储库地址
                that.setData({
                  cloudImage: ["commodity_information/" + id + "/" + that.data.num + "/one.png", "commodity_information/" + id + "/" + that.data.num + "/two.png", "commodity_information/" + id + "/" + that.data.num + "/three.png"]
                })
              })
            }
          })
        }, 500)
      },
      fail: console.error
    })
    // 启动该页面显示上传图片页
    this.setData({
      uploadView: 1
    })
    if (app.globalData.startRecord) {
      // wx.startRecord({
      //   success(res) {
      //     const tempFilePath = res.tempFilePath
      //   }
      // })
      // setTimeout(function () {
      //   wx.stopRecord() // 结束录音
      // }, 15000)
    } else {
      // 未授权时启用授权功能
      wx.authorize({
        scope: 'scope.record',
        success(res) {
          // this.setData({
          //   startRecord:true
          // })
        }
      })
    }

  },
  // 向data中写入标题
  input_Title: function(event) {
    this.setData({
      product_title: event.detail.value
    })
  },
  // 向data中写入详细信息
  input_detail: function(event) {
    this.setData({
      product_description: event.detail.value
    })
  },
  // 向data中写入价格
  input_prise: function(event) {
    this.setData({
      price: event.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
		app.globalData.srcFirst= ""
		app.globalData.srcSecond= ""
		app.globalData.srcThird= ""
		app.globalData.used= 1
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
		this.setData({
			srcFirst: app.globalData.srcFirst,
			srcSecond: app.globalData.srcSecond,
			srcThird: app.globalData.srcThird
		})
		if (app.globalData.used ==0){
			this.setData({
				show_photo: !this.datashow_photo
			})
		}
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

  }
})