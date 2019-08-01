// pages/Buyer_page/buyer.js
wx.cloud.init()
const app = getApp()
const APP_ID = 'wx5afc59b9050c809b'; //输入小程序appid 
const APP_SECRET = '88c181b87043338b0d564f53db42507c'; //输入小程序app_secret 
var OPEN_ID = '' //储存获取到openid 
var SESSION_KEY = '' //储存获取到session_key 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID: '',
    openid: '',
    show_modal:true,
    category:[1,2,3,4,5,6,7,8],
    secend:[11,22,33,44,55,66,77,88]
  },
  goZhuce: function() {
    wx.switchTab({
      url: '../Zhuce_page/zhuce'
    })
  },
  lookUser:function(){
    // wx.cloud.callFunction({
    //   // 需调用的云函数名
    //   name: 'add',
    //   // 传给云函数的参数
    //   data: {
    //     type:"get"
    //   },
    //   // 成功回调
    //   success:res=>{
    //     console.log("返回数据库的数据",res.result.data)
    //   },
    //   complete: console.log
    // })
  },
  uploadFils: function() {
    wx.cloud.uploadFile({
      cloudPath: 'ceshi/ceshi.txt',
      filePath: '/日志.txt', // 文件路径
      success: res => {
        // get resource ID
        console.log("成功上传", res.fileID);
        this.setData({
          fileID: res.fileID
        })       
      },
      fail: err => {
        // handle error
      }
    })
  },
  change:function(){
    this.setData({
      show_modal:!this.data.show_modal
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
// let promise1 = new Promise(function (resolve, reject) {
//   wx.cloud.uploadFile({
//     // 指定上传到的云路径
//     cloudPath: "commodity_information/" + that.data._openid + "/" + that.data.num + "/luyin.mp3",
//     // 指定要上传的文件的小程序临时文件路径
//     filePath: tempFilePathsm,
//     // 成功回调
//     success: res => {
//       console.log("tempFilePathsm", tempFilePathsm)
//       that.data.record_fileID.push(res.fileID)
//       console.log("录音上传成功，录音fileID", res.fileID)
//     },
//     fail: err => {
//       console.log("录音上传失败", err)
//     }
//   })
// });
// let promise2 = new Promise(function (resolve, reject) {
//   wx.cloud.uploadFile({
//     cloudPath: that.data.cloudImage[0],
//     filePath: that.data.tempFilePath[0], // 文件路径
//     success: res => {
//       // get resource ID
//       that.data.image_fileID.push(res.fileID)
//       console.log("图片fileID1", res.fileID)
//       this.setData({
//         uploadView: 1
//       })

//       console.log("图片上传成功" + 0)
//     },
//     fail(err) {
//       console.log(err)
//     }
//   })
// })
// let promise3 = new Promise(function (resolve, reject) {
//   wx.cloud.uploadFile({
//     cloudPath: that.data.cloudImage[1],
//     filePath: that.data.tempFilePath[1], // 文件路径
//     success: res => {
//       // get resource ID
//       that.data.image_fileID.push(res.fileID)
//       console.log("图片fileID2", res.fileID)
//       this.setData({
//         uploadView: 1
//       })

//       console.log("图片上传成功" + 1)
//     },
//     fail(err) {
//       console.log(err)
//     }
//   })
// })
// let promise4 = new Promise(function (resolve, reject) {
//   wx.cloud.uploadFile({
//     cloudPath: that.data.cloudImage[2],
//     filePath: that.data.tempFilePath[2], // 文件路径
//     success: res => {
//       // get resource ID
//       that.data.image_fileID.push(res.fileID)
//       console.log("图片fileID3", res.fileID)
//       this.setData({
//         uploadView: 1
//       })
//       console.log("图片上传成功" + 2)
//     },
//     fail: err => {
//       console.log(err)
//     }
//   })
// })
// let promise5 = new Promise(function (resolve, reject) {
//   // 上传数据库
//   wx.cloud.callFunction({
//     // 云函数名称
//     name: 'add',
//     // 传给云函数的参数
//     data: {
//       // 商品标题
//       product_title: that.data.product_title,
//       //商品详述
//       product_description: that.data.product_description,
//       // 价格
//       prise: that.data.price,
//       // 分类
//       input_category: that.data.input_category,
//       // 第几个商品（从0开始）
//       num: that.data.num,
//       // 云储存中图片fileID
//       image_fileID: that.data.image_fileID,
//       // 云储存中录音文件fileID
//       record_fileID: that.data.record_fileID
//     },
//     success(res) {
//       console.log("数据库上传成功")

//       // wx.hideLoading({
//       //   success(res) {
//       //     wx.showToast({
//       //       title: '上传成功',
//       //       icon: 'success',
//       //       duration: 2000
//       //     })
//       //   }
//       // }, 2000)
//     },
//     fail(err) { console.error }
//   })
// })
// let promise6 = new Promise(function (resolve, reject) {
//   wx.cloud.callFunction({
//     // 云函数名称
//     name: 'add',
//     // 传给云函数的参数
//     data: {
//       type: "replace"
//     },
//     success(res) {

//     },
//     fail: console.error
//   })
// })
// console.log("录音临时文件路径", that.data.recordFils)
// function getdata() {
//   wx.cloud.callFunction({
//     // 需调用的云函数名
//     name: 'add',
//     // 传给云函数的参数
//     data: {
//       type: "get",
//       num: that.data.num
//     },
//     // 成功回调
//     success: res => {
//       console.log("返回数据库的数据", res.result.data)
//       if (res.result.data.cloudImage.length == that.data.tempFilePath.length) {
//         console.log("对比后图片上传成功")
//         if (res.result.data.cloudPath.length === that.data.recordFils.length) {
//           console.log("对比后录音上传成功")
//           return true
//         }
//       }
//       return Promise.all(
//         [promise6]
//       )

//     },
//     complete: console.log
//   })
// }
// // // 上传图片临时路径tempFilePath: [],// 录音文件临时路径recordFils: [],
// if (that.data.recordFils.length == 1) {
//   Promise.all(
//     [promise1]
//   ).then(res => {
//     if (that.data.tempFilePath.length == 1) {
//       Promise.all(
//         [promise2]
//       )
//     }
//     if (that.data.tempFilePath.length == 2) {
//       Promise.all(
//         [promise2, promise3]
//       )
//     }
//     if (that.data.tempFilePath.length == 3) {
//       Promise.all(
//         [promise2, promise3, promise4]
//       )
//     }
//   }).then(res => {
//     setTimeout(function () {
//       Promise.all(
//         [promise5]
//       )
//     }, 4000)
//     // wx.hideLoading({
//     //   success(res) {
//     //     wx.showToast({
//     //       title: '上传成功',
//     //       icon: 'success',
//     //       duration: 2000
//     //     })
//     //   } 
//     // }, 2000)
//     that.setData({
//       data_setInterval: setInterval(function () {
//         console.log("执行定时器")
//         if (getdata()) {
//           console.log("成功上传")
//           wx.hideLoading({
//             success(res) {
//               wx.showToast({
//                 title: '上传成功',
//                 icon: 'success',
//                 duration: 2000
//               })
//             }
//           }, 2000)
//           clearInterval(that.data.data_setInterval)
//         }
//       }, 1000)
//     })

//   }).then(res => {
//     // 使用add云函数，对上传图片与录音ID和本地保存的id进行对比；相同，则提示上传成功；不同，则先将本地保存的云文件（录音与函数）ID进行删除，再通过  更大的延时  进行重新上传
//     // 提示每次重新上传  都对 延时时间进行加2s
//   })
// }
// if (that.data.recordFils.length == 0) {
//   Promise.all(
//     []
//   ).then(res => {
//     if (that.data.tempFilePath.length == 1) {
//       Promise.all(
//         [promise2]
//       )
//     }
//     if (that.data.tempFilePath.length == 2) {
//       Promise.all(
//         [promise2, promise3]
//       )
//     }
//     if (that.data.tempFilePath.length == 3) {
//       Promise.all(
//         [promise2, promise3, promise4]
//       )
//     }
//   }).then(res => {
//     Promise.all(
//       [promise5]
//     )
//     that.setData({
//       data_setInterval: setInterval(function () {
//         console.log("执行定时器")
//         if (getdata()) {
//           console.log("成功上传")
//           wx.hideLoading({
//             success(res) {
//               wx.showToast({
//                 title: '上传成功',
//                 icon: 'success',
//                 duration: 2000
//               })
//             }
//           }, 2000)
//           clearInterval(that.data.data_setInterval)
//         }
//       }, 1000)
//     })
//   })
// }