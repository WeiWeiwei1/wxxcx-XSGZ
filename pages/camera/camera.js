// pages/camara/camara.js
var app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		windowHeight: "",
		windowWidth: "",
		srcFirst: "",
		srcSecond: "",
		srcThird: "",
		count: 0,
	},
	// 拍照功能
	take_photo: function () {
		var that = this
		const ctx = wx.createCameraContext()
		ctx.takePhoto({
			quality: 'high',
			success: (res) => {
				if (that.data.count == 0) {
					this.setData({
						srcFirst: res.tempImagePath
					})
				}
				if (that.data.count == 1) {
					this.setData({
						srcSecond: res.tempImagePath
					})
				}
				if (that.data.count == 2) {
					this.setData({
						srcThird: res.tempImagePath
					})
				}
				that.setData({
					count: that.data.count + 1
				})
				if (this.data.count > 3) {
					this.setData({
						count: 3
					})
				}
			}
		})
		
	},
	// 取消上一次拍照
	take_cancel: function () {
		if (this.data.count == 1) {
			this.setData({
				srcFirst: "",
				count: this.data.count - 1
			})
		}
		if (this.data.count == 2) {
			this.setData({
				srcSecond: "",
				count: this.data.count - 1
			})
		}
		if (this.data.count == 3) {
			this.setData({
				srcThird: "",
				count: this.data.count - 1
			})
		}
		
	},
	// 退出拍照
	take_quit: function () {
		
	},
	//拍照完成
	take_success: function () {
		var one = this.data.srcFirst
			// 相机页数据
		  app.globalData.srcFirst= this.data.srcFirst,
			app.globalData.srcSecond= this.data.srcSecond,
			app.globalData.srcThird= this.data.srcThird,
			app.globalData.used=0
	
		// wx.redirectTo({
		// 	url: '../camara2/camara2?src1=' + this.data.srcFirst + '&src2=' + this.data.srcSecond + '&src3=' + this.data.srcThird
		// })
		wx.navigateBack({
			delta: 1
		})
	},
	// 保存图片到本地
	save_photo: function () {
		wx.saveImageToPhotosAlbum({
			filePath: this.data.srcFirst,
			success(res) {
				console.log("图片保存成功")
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				console.log(res);
				// 屏幕宽度、高度
				console.log('height=' + res.windowHeight);
				console.log('width=' + res.windowWidth);
				// 高度,宽度 单位为px
				that.setData({

					windowHeight: res.windowHeight,

					windowWidth: res.windowWidth
				})
			}
		})
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