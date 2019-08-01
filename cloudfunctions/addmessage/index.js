// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()

	return new Promise(function (resolve, reject) {
		db.collection('message').add({
			data: {
				_openid: wxContext.OPENID,
				name: event.name,
				avatarUrl: event.avatarUrl,
				msg: []
			},
			success: function (res) {
				resolve(res)
			}
		})
	})
}