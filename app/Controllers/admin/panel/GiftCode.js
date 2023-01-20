
var validator = require('validator');
var shortid   = require('shortid');
var GiftCode  = require('../../../Models/GiftCode');

function get_data(client, data){
	if (!!data && !!data.page) {
		var page  = data.page>>0;
		var kmess = 10;
		if (page > 0) {
			GiftCode.estimatedDocumentCount().exec(function(err, total){
				GiftCode.find({}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					client.red({giftcode:{get_data:{data:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}

function get_gift(client){
	client.red({giftcode:{get_gift:shortid.generate()}});
}

function create_gift(client, data){
	if (!!data && !!data.giftcode &&
		!!data.ngay &&
		!!data.thang &&
		!!data.nam)
	{
		if (!validator.isEmpty(data.giftcode)) {
			var giftcode = ''+data.giftcode+'';
			var red      = data.red>>0;
			var xu       = data.xu>>0;
			var type     = data.chung;
			var ngay     = (data.ngay>>0)+1;
			var thang    = (data.thang>>0)-1;
			var nam      = data.nam>>0;

			giftcode = giftcode.toLowerCase();

			GiftCode.findOne({'code':giftcode}, function(err, check) {
				if (!!check) {
					client.red({notice:{title:'THẤT BẠI',text:'Mã GiftCode đã tồn tại...'}});
				}else{
					try {
						GiftCode.create({'code':giftcode, 'red':red, 'xu':xu, 'type':type, 'date': new Date(), 'todate': new Date(nam, thang, ngay)}, function(errgift, gift){
							if (!!gift){
								GiftCode.estimatedDocumentCount().exec(function(err, total){
									GiftCode.find({}, {}, {sort:{'_id':-1}, skip: 0, limit: 10}, function(err, result) {
										client.red({giftcode:{get_data:{data:result, page:1, kmess:10, total:total}}, notice:{title:'TẠO GIFTCODE',text:'Tạo gift code thành công...'}});
									});
								});
							}
						});
					} catch (error) {
						client.red({notice:{title:'THẤT BẠI',text:'Mã GiftCode đã tồn tại...'}});
					}
				}
			})
		}
	}
}

function remove(client, id){
	if (!!id) {
		GiftCode.findOne({'_id': id}, function(err, check) {
			if (!!check) {
				var active = GiftCode.findOneAndRemove({'_id': id}).exec();
				Promise.all([active])
				.then(values => {
					GiftCode.estimatedDocumentCount().exec(function(err, total){
						GiftCode.find({}, {}, {sort:{'_id':-1}, skip: 0, limit: 10}, function(err, data){
							client.red({banklist:{remove:true}, giftcode:{get_data:{data:data, page:1, kmess:10, total:total}}, notice:{title:'GIFT CODE',text:'Xoá thành công...'}});
						});
					});
				})
			}else{
				GiftCode.estimatedDocumentCount().exec(function(err, total){
					GiftCode.find({}, {}, {sort:{'_id':-1}, skip: 0, limit: 10}, function(err, data){
						client.red({giftcode:{get_data:{data:data, page:1, kmess:10, total:total}}, notice:{title:'GIFT CODE',text:'Gift code không tồn tại...'}});
					});
				});
			}
		})
	}
}

function checkMid(client, mid){
	if (!!mid) {
		GiftCode.findOne({'type': mid}, function(err, check) {
			if (!!check) {
				client.red({notice:{title:'GIFT CODE',text:'Mã Chung đã tồn tại...'}});
			}else{
				client.red({notice:{title:'GIFT CODE',text:'Mã Chung không tồn tại...'}});
			}
		})
	}
}

module.exports = function (client, data) {
	if (!!data) {
		if (!!data.get_data) {
			get_data(client, data.get_data)
		}

		if (!!data.get_gift) {
			get_gift(client)
		}

		if (!!data.create_gift) {
			create_gift(client, data.create_gift)
		}

		if (!!data.checkMid) {
			checkMid(client, data.checkMid)
		}

		if (!!data.remove) {
			remove(client, data.remove)
		}
	}
}
