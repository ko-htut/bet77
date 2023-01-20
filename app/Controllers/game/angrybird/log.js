
var AngryBirds_red = require('../../../Models/AngryBirds/AngryBirds_red');
var AngryBirds_xu  = require('../../../Models/AngryBirds/AngryBirds_xu');

module.exports = function(client, data){
	if(!!data && !!data.page){
		var page = data.page>>0; // trang
		var red  = !!data.red;   // Loại tiền (Red: true, Xu: false)
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			var kmess = 8;
			if (red) {
				AngryBirds_red.countDocuments({name: client.profile.name}).exec(function(err, total){
					AngryBirds_red.find({name: client.profile.name}, 'id win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({mini:{arb:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else{
				AngryBirds_xu.countDocuments({name: client.profile.name}).exec(function(err, total){
					AngryBirds_xu.find({name: client.profile.name}, 'id win bet time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({mini:{arb:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}
		}
	}
};
