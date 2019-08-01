// pages/Commodity_description/description.js
var myslider = require('../../utils/yxxrui.slider.js');
const audio = wx.createInnerAudioContext()
wx.cloud.init()
var tempFilePaths = []
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		imgFileSrc:[],
		recordFileSrc:[],
		src:[],
		datas:"",
		// 轮播图文件
		indicatorDots: false,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		curPage: 1,
		x: 0,
		// 音频是否正在播放
		audio_play: 0,
		//判断轮播图数据是否加载
		slider:0,
		slider_datas:[],
		//设置定时器1
		setInterval_one:"",
	},
	// 播放录音
	playRecord:function(){
		audio.src = this.data.recordFileSrc[0].tempFileURL
		console.log(audio.paused)
		if (this.data.audio_play === 0) {
			audio.play()
		} else {
			audio.pause()
		}
	},
	//与卖家联系---如果聊天页已经有该卖家，则直接打开；若没有，则新建一个聊天对象
	chat:function(){
		
	},
	//打开购物车
	trolley:function(){
		wx.navigateTo({
			url:"../trolley/trolley?openid="+this.data.datas.openid
		})
	},
	//打开该卖家所有商品
	shop:function(){

	},
	//把该商品加入购物车中
	add_trolley:function(){
		var that = this
		wx.cloud.callFunction({
			// 要调用的云函数名称
			name: 'user',
			// 传递给云函数的event参数
			data: {
				type:"trolly",
				comodity_id:that.data.datas.comodity_id
			}
		}).then(res => {
			console.log(res)
		}).catch(err => {
			// handle error
		})
	},
	//购买该商品
	buy:function(){
		
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		var that2 = this
		console.log(options.id)
		wx.cloud.callFunction({
			// 云函数名称
			name: 'getdata',
			// 传给云函数的参数
			data: {
				type: "commodityid",
				commodity_id: options.id
			},
			success: function (res) {
				console.log(res) // 3
				// 写入商品数据库信息
				that.setData({
					datas:res.result.data[0]
				})
				// 获取图片及录音的临时链接
				var promiseArr = []
				promiseArr.push(new Promise((resolve,reject)=>{
					wx.cloud.getTempFileURL({
						fileList: res.result.data[0].image_fileID,
						max_age: 100000,
						success: res => {
							// get temp file URL
							console.log("111",res.fileList)
							that2.setData({
								imgFileSrc: res.fileList
							})
							that.setData({
								slider:1
							})
						},
						fail: err => {
							// handle error
						}
					})
				}))
				promiseArr.push(new Promise((resolve,reject)=>{
					wx.cloud.getTempFileURL({
						fileList: res.result.data[0].record_fileID,
						max_age: 100000,
						success: res => {
							// get temp file URL
							console.log("222",res.fileList)
							that2.setData({
								recordFileSrc: res.fileList
							})
						},
						fail: err => {
							// handle error
						}
					})
				}))
				Promise.all(promiseArr)
			},
			fail: console.error
		})
		setTimeout(function(){
			myslider.initMySlider({
				that: that,
				datas: [that.data.imgFileSrc[0].tempFileURL, that.data.imgFileSrc[1].tempFileURL, that.data.imgFileSrc[2].tempFileURL],
				autoRun: true,
				blankWidth: 12,
				newImgWidth: 18,
				interval: 1500,
				duration: 200,
				direction: 'left',
				startSlide: function (curPage) {

				},
				endSlide: function (curPage) {

				}
			});
		},2000)
		//每秒执行一次，当slider = 0时执行
		// this.setData({
		// 	setInterval_one: setInterval(function(){
		// 		if(that.data.slider == 0){
		// 			myslider.initMySlider({
		// 				that: that,
		// 				datas: [that.data.imgFileSrc[0].tempFileURL, that.data.imgFileSrc[1].tempFileURL, that.data.imgFileSrc[2].tempFileURL],
		// 				autoRun: true,
		// 				blankWidth: 12,
		// 				newImgWidth: 18,
		// 				interval: 1500,
		// 				duration: 200,
		// 				direction: 'left',
		// 				startSlide: function (curPage) {

		// 				},
		// 				endSlide: function (curPage) {

		// 				}
		// 			});
		// 		}
		// 		if(that.data.slider ==1){
		// 			setTimeout(function(){
		// 				clearInterval(that.data.setInterval_one)
		// 			},3000)
		// 		}
		// 	},1000)
		// })
		
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