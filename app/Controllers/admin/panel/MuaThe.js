
var UserInfo    = require('../../../Models/UserInfo');
var MuaThe      = require('../../../Models/MuaThe');
var MuaThe_card = require('../../../Models/MuaThe_card');

function get_data(client, data){
	if (!!data && !!data.page) {
		var status = data.status>>0;
		var page   = data.page>>0;
		var kmess  = 10;

		if (page > 0) {
			if (status == -1) {
				MuaThe.estimatedDocumentCount().exec(function(err, total){
					MuaThe.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								obj = obj._doc;
								var user = UserInfo.findOne({id: obj.uid}, 'name').exec();
								return Promise.all([user]).then(values => {
									var dataOJ = values[0]._doc;
									delete dataOJ._id;
									Object.assign(obj, dataOJ);
									delete obj.__v;
									delete obj.uid;
									return obj;
								});
							}))
							.then(function(arrayOfResults) {
								client.red({mua_the:{get_data:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
							})
						}else{
							client.red({mua_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
						}
					});
				});
			}else{
				var query = status == 0 ? {status: 0} : {status: {$gt: 0}};
				MuaThe.countDocuments(query).exec(function(err, total){
					MuaThe.find(query, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								obj = obj._doc;
								var user = UserInfo.findOne({id: obj.uid}, 'name').exec();
								return Promise.all([user]).then(values => {
									var dataOJ = values[0]._doc;
									delete dataOJ._id;
									Object.assign(obj, dataOJ);
									delete obj.__v;
									delete obj.uid;
									return obj;
								});
							}))
							.then(function(arrayOfResults) {
								client.red({mua_the:{get_data:{data:arrayOfResults, page:page, kmess:kmess, total:total}}});
							})
						}else{
							client.red({mua_the:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
						}
					});
				});
			}
		}
	}
}
function get_info(client, id){
	if (!!id) {
		MuaThe_card.find({'cart': id}, 'maThe menhGia nhaMang seri time', function(err, data){
			client.red({mua_the:{get_info:{id:id, card: data}}});
		})
	}
}

function update(client, data){
	if (!!data && !!data.cart && !!data.card) {
		var status = data.status>>0;
		var cart   = data.cart;

		MuaThe.updateOne({'_id': cart}, {$set:{status:status}}).exec(function(err, mua){
			if (!!mua) {
				if (mua.status != status) {
					var tien = mua.menhGia*mua.soLuong;
					if (status == 2) {
						// trả lại
						UserInfo.updateOne({id:mua.uid}, {$inc:{red:tien}}).exec();
					}else if (mua.status == 2) {
						UserInfo.findOne({id:mua.uid}, 'red').exec(function(err2, user){
							if (user && user.red >= tien) {
								// mua lại
								UserInfo.updateOne({id:mua.uid}, {$inc:{red:-tien}}).exec();
							}
						});
					}
				}
			}
		});

		if (Array.isArray(data.card)) {
			Promise.all(data.card.map(function(obj){
				MuaThe_card.updateOne({'_id':obj.id}, {$set: obj.card}).exec();
			}))
		}
		client.red({mua_the:{update: data}});
	}
}

module.exports = function (client, data) {
	if (!!data) {
		if (void 0 !== data.get_data) {
			get_data(client, data.get_data)
		}
		if (void 0 !== data.get_info) {
			get_info(client, data.get_info)
		}
		if (void 0 !== data.update) {
			update(client, data.update)
		}
	}
}
