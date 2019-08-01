// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const MAX_LIMIT = 30;
// 云函数入口函数
exports.main = async(event, context) => {
  if (event.type == "category") {
    db.collection('comodity').where({
        input_category: event.category
      })
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data)
          return res.data
        }
      })
  }
  if (event.type == "date") {
		// 先取出集合记录总数
		const countResult = await db.collection('comodity').count()
		const total = countResult.total
		// 计算需分几次取
		const batchTimes = Math.ceil(total / 100)
		// 承载所有读操作的 promise 的数组
		const tasks = []
		const promise = db.collection('comodity').skip(event.time *30).limit(30).get()
		tasks.push(promise)
		if (event.time * 30 > countResult) return "allSuccess";
		// 等待所有
		return (await Promise.all(tasks)).reduce((acc, cur) => {
			return {
				data: acc.data.concat(cur.data),
				errMsg: acc.errMsg,
			}
		})
  }
	if(event.type === "commodityid"){
		// var promise1 = new Promise((resolve,reject)=>{
		// 	db.collection('comodity').where({
		// 		comodity_id: event.commodity_id
		// 	})
		// 		.get({
		// 			success(res) {
		// 				// res.data 是包含以上定义的两条记录的数组
		// 				console.log(res.data)
		// 				resolve(res)
		// 			}
		// 		})
		// })
		return db.collection('comodity').where({
				"comodity_id": event.commodity_id
			}).get()
	}


  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}