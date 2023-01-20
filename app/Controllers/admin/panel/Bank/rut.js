
var Bank_history = require('../../../../Models/Bank/Bank_history');
var UserInfo     = require('../../../../Models/UserInfo');

module.exports = function (client, data) {
	if(!!data.status && !!data.page){
		var kmess = 10;
		var page  = data.page>>0;
		if (!!data.find) {
			var find = data.find>>0;
			Bank_history.countDocuments({GD:find}).exec(function(err, total){
				Bank_history.find({GD:find}, {}, {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(err, search){
					if (search) {
						Promise.all(search.map(function(obj){
							obj = obj._doc;
							delete obj.__v;
							delete obj.type;
							return new Promise(function(resolve, reject) {
								UserInfo.findOne({'id': obj.uid}, function(error, result3){
									obj.nick = !!result3 ? result3.name : '';
									resolve(obj);
								})
							});
						}))
						.then(result => {
							client.red({bankrut:{data:result, page:page, kmess:kmess, total:total}});
						});
					}else{
						client.red({bankrut:{data:[], page:1, kmess:kmess, total:0}});
					}
				});
			});
		}else{
			Bank_history.countDocuments({type:1, status:data.status}).exec(function(err, total){
				Bank_history.find({type:1, status:data.status}, {}, {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(err, search){
					if (search) {
						Promise.all(search.map(function(obj){
							obj = obj._doc;
							delete obj.__v;
							delete obj.type;
							return new Promise(function(resolve, reject) {
								UserInfo.findOne({'id': obj.uid}, function(error, result3){
									obj.nick = !!result3 ? result3.name : '';
									resolve(obj);
								})
							});
						}))
						.then(result => {
							client.red({bankrut:{data:result, page:page, kmess:kmess, total:total}});
						});
					}else{
						client.red({bankrut:{data:[], page:1, kmess:kmess, total:0}});
					}
				});
			});
		}
	}
}
