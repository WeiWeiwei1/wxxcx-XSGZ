// pages/index/index.js
wx.cloud.init
const audio = wx.createInnerAudioContext()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 云获取的所有数据信息
    data_all:[],
    // 录音临时文件链接
    record_links:[],
		// 图片fileId
		imagefileID:[],
		imageURL:[],
		// 记录获取商品次数
		comment_time:0,
		// 音频是否正在播放
		audio_play:0
  },
	// 播放和暂停录音
	click_record:function(res){
		console.log("audio_play",this.data.audio_play)
		var that = this
		var index = res.target.dataset.index
		// console.log(res)
		console.log(res.target.dataset.index)
		// console.log(that.data.data_all[index].record_fileID)
		// 获取录音链接
		wx.cloud.getTempFileURL({
			fileList: [{
				fileID: that.data.data_all[index].record_fileID[0],
				maxAge: 60 * 60, // one hour
			}]
		}).then(res => {
			// get temp file URL
			console.log(res.fileList[0].tempFileURL,"filelist")
			audio.src=res.fileList[0].tempFileURL
			console.log(audio.paused)
			if (this.data.audio_play===0){
				audio.play()
			}else{
				audio.pause()
			}
		}).catch(error => {
			// handle error
		})
		
	},
	// 跳转到商品详细页
	gotoCommodity:function(res){
		console.log(res)
		console.log(res.currentTarget.dataset.commodity)
		var serial_number = res.currentTarget.dataset.commodity
		var data_this = this.data.data_all[serial_number]
		wx.navigateTo({
			url: `../Commodity_description/description?id=${ serial_number }`
		})
		
	},
	//执行一次获取30个数据
	threeCommodity:function(){
		var that = this
		wx.cloud.callFunction({
			// 要调用的云函数名称
			name: 'getdata',
			// 传递给云函数的event参数
			data: {
			type:"date",
			time:that.data.comment_time
			}
		}).then(res => {
			that.setData({
				data_all:that.data.data_all.concat(res.result.data)
			})
			console.log(res)
			that.setData({
				comment_time : that.data.comment_time+1
			})
			// 将所有商品第一张图片得fileid放入imagefileID中
			function runAsyc1(){
				var promise1 = new Promise((resolve, reject) => {
					for (let i = 0; i < res.result.data.length; i++) {
						that.setData({
							imagefileID: that.data.imagefileID.concat(res.result.data[i].image_fileID[0])
						})
						if (i == res.result.data.length - 1){
							resolve()
						}
					}
				})
				return promise1
			}
			runAsyc1().then(wx.cloud.getTempFileURL({
				fileList: that.data.imagefileID,
				max_age:100000,
				success: res => {
					// get temp file URL
					console.log(res.fileList)
					that.setData({
						imageURL:res.fileList
					})
				},
				fail: err => {
					// handle error
				}
			}))
		}).catch(err => {
			// handle error
			console.log(err)	
		})
	},
	// 排序方法
	sort_data_first:function(type){
		// 综合排序【按时间先后】  分类排序【类型+时间】   价格分类【由高到低  由低到高】
		
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
    this.threeCommodity()
		audio.onStop(()=>{
			//audio_play = 0
			that.setData({
				audio_play:0
			})
		})
		audio.onPlay(()=>{	
			//audio_play = 1
			that.setData({
				audio_play: 1
			})	
		})
		audio.onPause(()=>{
			//audio_play = 0
			that.setData({
				audio_play: 0
			})
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
		this.threeCommodity()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})