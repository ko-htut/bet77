
let xsmb_cuoc = require('../../../../../Models/XoSo/mb/xsmb_cuoc');

module.exports = function(client, data) {
	if (!!data.date) {
		let page = data.page>>0;
		if (page > 0) {
			xsmb_cuoc.countDocuments({date:data.date}).exec(function(err, total){
				xsmb_cuoc.find({date:data.date}, {}, {sort:{'_id':-1}, skip:(page-1)*10, limit:10}, function(err, result) {
					result.forEach(function(obj){
						obj = obj._doc;
						delete obj._id;
					});
					client.red({xs:{mb:{history:{data:result, page:page, kmess:10, total:total}}}});
				});
			});
		}
	}
}
