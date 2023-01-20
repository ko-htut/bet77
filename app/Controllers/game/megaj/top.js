
let MegaJP_spin = require('../../../Models/MegaJP/MegaJP_spin');

module.exports = function(client, page){
	page = page>>0;
	if (page > 0) {
		let kmess = 8;
		MegaJP_spin.countDocuments({}).exec(function(err, total){
			MegaJP_spin.find({}, 'name room win time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
				result.forEach(function(obj){
					obj = obj._doc;
					delete obj._id;
				});
				client.red({mini:{megaj:{top:{data:result, page:page, kmess:kmess, total:total}}}});
			});
		});
	}
};
