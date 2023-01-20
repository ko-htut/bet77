
var TXPhien = require('../../../../../Models/TaiXiu_phien');
var TXCuoc  = require('../../../../../Models/TaiXiu_cuoc');

module.exports = function(client, data){
	if (!!data.id) {
		var taixiu = !!data.taixiu;
		var red    = !!data.red;
		var page   = data.page>>0;
		var kmess = 10;

		if (page > 0) {
			TXCuoc.countDocuments({uid:data.id, thanhtoan:true, taixiu:taixiu, red:red}).exec(function(err, total){
				var getCuoc = TXCuoc.find({uid:data.id, thanhtoan:true, taixiu:taixiu, red:red}, {}, {sort:{'_id': -1}, skip: (page-1)*kmess, limit: kmess}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							var getPhien = TXPhien.findOne({id: obj.phien}).exec();
							return Promise.all([getPhien]).then(values => {
								Object.assign(obj, values[0]._doc);
								delete obj.__v;
								delete obj._id;
								delete obj.thanhtoan;
								delete obj.id;
								delete obj.uid;
								return obj;
							});
						}))
						.then(function(arrayOfResults) {
							client.red({users:{taixiu:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
						})
					}else{
						client.red({users:{taixiu:{data: [], page:page, kmess:kmess, total:0}}});
					}
				});
			});
		}
	}
}
