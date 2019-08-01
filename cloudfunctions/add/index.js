// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
var count;
function getdatabase(event, context){
  
}
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  count = event.num+""
  if(event.type == "get"){
    return db.collection("comodity").where({ comodity_id: wxContext.OPENID + "" + "$" + count}).get()                                                  
  }    
  return new Promise(function(resolve, reject) {
    
    db.collection('comodity').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid: wxContext.OPENID,
        comodity_id: wxContext.OPENID + "" + "$" + count,
        uploadDate: new Date(),
        title: event.product_title,
        prise: event.prise,
        description: event.product_description,
        input_category: event.input_category,
        image_fileID:event.image_fileID, 
        record_fileID:event.record_fileID,
				putaway:true,
				bought:false,
				collect:0
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  })
	
}