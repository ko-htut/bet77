
var MuaXu     = require('../../Models/MuaXu');
var UserInfo  = require('../../Models/UserInfo');

var validator = require('validator');
var Helper    = require('../../Helpers/Helpers');

module.exports = function(client, data){
	if (!!data && !!data.captcha) {
		if (!validator.isLength(data.captcha, {min: 4, max: 4})) {
			client.red({notice: {title: 'LỖI', text: 'Captcha không hợp lệ !!'}});
		}else{
			var red = data.red>>0;
			var checkCaptcha = new RegExp('^' + data.captcha + '$', 'i');
				checkCaptcha = checkCaptcha.test(client.captcha);
			if (checkCaptcha) {
				if (red < 100) {
					client.red({notice:{title:'MUA XU', text:'Tối thiểu 100 RED.!!'}});
				}else{
					UserInfo.findOne({id: client.UID}, 'red xu', function(err, check){
						if (check === null || (check.red < red)) {
							client.red({notice:{title:'MUA XU',text:'Số dư không khả dụng.!!'}});
						}else{
							var xu = red*3;
							check.red -= red;
							check.xu   = check.xu*1 + xu;
							check.save();

							client.red({notice:{title:'MUA XU', text:'Mua thành công ' + Helper.numberWithCommas(xu) + ' xu.'}, user:{red: check.red, xu: check.xu}});

							MuaXu.create({'uid':client.UID, 'red':red, 'xu':xu, 'time': new Date()});
						}
					});
				}
			}else{
				client.red({notice:{title:'MUA XU', text:'Captcha không đúng'}});
			}
		}
	}
	client.c_captcha('withdrawXu');
}
