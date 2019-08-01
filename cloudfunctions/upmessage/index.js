
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	return new Promise(function (resolve, reject) {
		db.collection('message').doc(event.face_id).update({
			data: {
				msg: event.message
			},
			success: function (res) {
				resolve(res)
			}
		})
	})
}