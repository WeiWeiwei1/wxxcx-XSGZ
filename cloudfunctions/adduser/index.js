// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

	return new Promise((resolve, reject) => {
		db.collection("user").add({
			data: {
				_openid: event.openid,
				nickName: event.name,
				avatarUrl: event.avatarUrl,
				favorite: [],
				comodity: [],
				browse: [],
				trolly: [],
				bought: [],
				share: []
			}
		})
	})
}