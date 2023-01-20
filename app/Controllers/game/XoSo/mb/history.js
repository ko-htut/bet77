
let xsmb_cuoc = require('../../../../Models/XoSo/mb/xsmb_cuoc');

module.exports = function(client, page){
	page = page>>0;
	if (page > 0) {
		let kmess = 10;
		xsmb_cuoc.countDocuments({name:client.profile.name}).exec(function(err, total){
			xsmb_cuoc.find({name:client.profile.name}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				result.forEach(function(obj){
					obj = obj._doc;
					delete obj._id;
				});
				client.red({XoSo:{history:{mb:{data:result, page:page, kmess:kmess, total:total}}}});
			});
		});
	}
};
