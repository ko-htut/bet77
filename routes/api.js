
let tab_NapThe = require('../app/Models/NapThe');
let MenhGia    = require('../app/Models/MenhGia');

let UserInfo   = require('../app/Models/UserInfo');

let config     = require('../config/thecao');

let Helper     = require('../app/Helpers/Helpers');

//let fs = require('fs');

module.exports = function(app, redT) {
	// Sign API

	app.get('/api/callback/prepaid_card', function(req, res) {
		return res.render('callback/prepaid_card');
	});
	app.post('/api/callback/prepaid_card', function(req, res) {
		try {
			//console.log('callback');
			//console.log(req.body);
			//var data = JSON.parse(body);
			let data = req.body;
			if (!!data && !!data.status && !!data.request_id) {
				if (data.status == '1') {
					// thành công
					tab_NapThe.findOneAndUpdate({'_id':data.request_id}, {$set:{status:1}}, function(err, napthe) {

						console.log(napthe);
						if (!!napthe && napthe.nhan == 0) {
							MenhGia.findOne({name:napthe.menhGia, nap:true}, {}, function(errMG, dataMG){
								if (!!dataMG) {
									let nhan = dataMG.values;
									UserInfo.findOneAndUpdate({'id':napthe.uid}, {$inc:{red:nhan}}, function(err2, user) {
										if (void 0 !== redT.users[napthe.uid]) {
											Promise.all(redT.users[napthe.uid].map(function(obj){
												obj.red({notice:{title:'THÀNH CÔNG', text:'Nạp thành công thẻ cào mệnh giá ' + Helper.numberWithCommas(dataMG.values), load:false}, user:{red:user.red*1+nhan}});
											}));
										}
									});
									tab_NapThe.updateOne({'_id':data.request_id}, {$set:{nhan:nhan}}).exec();
								}
							});
						}
					});
				}else{
					// thất bại
					tab_NapThe.findOneAndUpdate({'_id':data.request_id}, {$set:{status:2}}, function(err, napthe) {
						if (!!napthe) {
							if (void 0 !== redT.users[napthe.uid]) {
								Promise.all(redT.users[napthe.uid].map(function(obj){
									obj.red({notice:{title:'THẤT BẠI', text:config[data.status], load:false}});
								}));
							}
						}
					});
				}
			}
		} catch(errX){
			//
		}
		return res.render('callback/prepaid_card');
	});
};
