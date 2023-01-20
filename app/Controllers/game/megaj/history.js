
let MegaJP_nhan = require('../../../Models/MegaJP/MegaJP_nhan');
let MegaJP_spin = require('../../../Models/MegaJP/MegaJP_spin');

let quay = function(client, page){
	page = page>>0;
	if (page > 0) {
		let kmess = 8;
		MegaJP_spin.countDocuments({name:client.profile.name}).exec(function(err, total){
			MegaJP_spin.find({name:client.profile.name}, 'room kq win time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				result.forEach(function(obj){
					obj = obj._doc;
					delete obj._id;
				});
				client.red({mini:{megaj:{history:{quay:{data:result, page:page, kmess:kmess, total:total}}}}});
			});
		});
	}
}

let nhanve = function(client, page){
	page = page>>0;
	if (page > 0) {
		let kmess = 8;
		MegaJP_nhan.countDocuments({uid:client.UID}).exec(function(err, total){
			MegaJP_nhan.find({uid:client.UID}, 'room to sl status time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				result.forEach(function(obj){
					obj = obj._doc;
					delete obj._id;
				});
				client.red({mini:{megaj:{history:{nhanve:{data:result, page:page, kmess:kmess, total:total}}}}});
			});
		});
	}
}

module.exports = function(client, data){
	if (!!data.quay) {
		quay(client, data.quay);
	}
	if (!!data.nhanve) {
		nhanve(client, data.nhanve);
	}
};
