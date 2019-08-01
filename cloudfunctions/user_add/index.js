// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  return new Promise(function(resolve,reject){
		db.collection('user').add({
			// data 字段表示需新增的 JSON 数据
			data: {
				_openid: wxContext.OPENID,
				favorite: [],
				comodity: [],
				browse: [],
				trolly: [],
				bought: [],
				share: []
			},
			success: function (ress) {
				// res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
				console.log(ress)
				resolve(ress)
			},
			fail: console.error
		})
	})

}