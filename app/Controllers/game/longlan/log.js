
var LongLan_red = require('../../../Models/LongLan/LongLan_red');
var LongLan_xu  = require('../../../Models/LongLan/LongLan_xu');

module.exports = function(client, data){
	if (!!data && !!data.page) {
		var page = data.page>>0; // trang
		var red  = !!data.red;   // Loại tiền (Red: true, Xu: false)
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			var kmess = 8;
			if (red) {
				LongLan_red.countDocuments({name: client.profile.name}).exec(function(err, total){
					LongLan_red.find({name: client.profile.name}, 'id win bet line time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({longlan:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
						})
					});
				})
			}else{
				LongLan_xu.countDocuments({name: client.profile.name}).exec(function(err, total){
					LongLan_xu.find({name: client.profile.name}, 'id win bet line time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({longlan:{log:{data:resultArr, page:page, kmess:kmess, total:total}}});
						})
					});
				})
			}
		}
	}
};
