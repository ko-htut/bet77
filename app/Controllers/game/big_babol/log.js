
const BigBabol_red = require('../../../Models/BigBabol/BigBabol_red');
const BigBabol_xu  = require('../../../Models/BigBabol/BigBabol_xu');

module.exports = function(client, data){
	var page = data.page>>0; // trang
	var red  = !!data.red;                    // Loại tiền (Red: true, Xu: false)
	if (page < 1) {
		client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
	}else{
		var kmess = 8;
		if (red) {
			BigBabol_red.countDocuments({name: client.profile.name}).exec(function(err, total){
				BigBabol_red.find({name: client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({mini:{big_babol:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
					})
				});
			})
		}else{
			BigBabol_xu.countDocuments({name: client.profile.name}).exec(function(err, total){
				BigBabol_xu.find({name: client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					Promise.all(result.map(function(obj){
						obj = obj._doc;
						delete obj._id;
						return obj;
					}))
					.then(resultArr => {
						client.red({mini:{big_babol:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
					})
				});
			})
		}
	}
};
