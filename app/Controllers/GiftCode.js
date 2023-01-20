
var UserInfo  = require('../Models/UserInfo');
var GiftCode  = require('../Models/GiftCode');

var validator = require('validator');
var Helpers   = require('../Helpers/Helpers');

module.exports = function(client, data){
	if (!!data.captcha && !!data.code) {
		if (!validator.isLength(data.captcha, {min: 4, max: 4})) {
			client.red({notice: {title: 'LỖI', text: 'Captcha không đúng...'}});
		}else if (!validator.isLength(data.code, {min: 4, max: void 0})) {
			client.red({notice: {title: 'LỖI', text: 'GiftCode không tồn tại !!'}});
		} else {
			var checkCaptcha = new RegExp('^' + data.captcha + '$', 'i').test(client.captcha);
			if (checkCaptcha) {
				var code = ''+data.code+'';
				code = code.toLowerCase();

				GiftCode.findOne({'code':code}, {}, function(err, check) {
					if (!!check) {
						var d1 = Date.parse(new Date());
						var d2 = Date.parse(check.todate);
						if (d2 > d1) {
							if (void 0 !== check.uid) {
								client.red({notice:{title:'THẤT BẠI',text:'Mã Gift Code đã qua sử dụng.' + '\n' + ' Hãy thử một mã khác...'}});
							}else{
								if (validator.isEmpty(check.type)) {
									check.uid = client.UID;
									check.save();
									UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:check.red, xu:check.xu}}).exec(function(err, user){
										client.red({notice:{title:'THÀNH CÔNG',text:'Bạn nhận được: ' + (check.red > 0 ? Helpers.numberWithCommas(check.red) + ' RED' : '') + (check.xu > 0 ? (check.red > 0 ? ' và ' : '') + Helpers.numberWithCommas(check.xu) + ' XU' : '')}, user:{red:user.red*1+check.red, xu:user.xu*1+check.xu}});
									});
								}else{
									GiftCode.findOne({'uid': client.UID, 'type': check.type}, 'code', function(err, check2) {
										if (!!check2) {
											client.red({notice:{title:'THẤT BẠI',text:'Bạn đã từng sử dụng họ Gift Code này trước đây...!!'}});
										}else{
											check.uid = client.UID;
											check.save();
											UserInfo.findOneAndUpdate({id: client.UID}, {$inc:{red:check.red, xu:check.xu}}).exec(function(err, user){
												client.red({notice:{title:'THÀNH CÔNG',text:'Bạn nhận được: ' + (check.red > 0 ? Helpers.numberWithCommas(check.red) + ' RED' : '') + (check.xu > 0 ? (check.red > 0 ? ' và ' : '') + Helpers.numberWithCommas(check.xu) + ' XU' : '')}, user:{red:user.red*1+check.red, xu:user.xu*1+check.xu}});
											});
										}
									})
								}
							}
						}else{
							client.red({notice:{title:'THẤT BẠI',text:'Mã Gift Code Đã hết hạn...!!'}});
						}
					}else{
						client.red({notice:{title:'THẤT BẠI',text:'Mã Gift Code không tồn tại...!!'}});
					}
				});
			}else{
				client.red({notice:{title:'THẤT BẠI',text:'Captcha không đúng.'}});
			}
		}
	}
	client.c_captcha('giftcode');
}
