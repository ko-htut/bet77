
let UserInfo = require('../Models/UserInfo');
let OTP      = require('../Models/OTP');
let Phone    = require('../Models/Phone');
let telegram = require('../Models/Telegram');

let smsOTP   = require('../sms').sendOTP;

function createOTP(client, type){
	type = type>>0;
	Phone.findOne({'uid':client.UID}, function(err3, check){
		if (check) {
			OTP.findOne({'uid': client.UID, 'phone':check.phone}, {}, {sort:{'_id':-1}}, function(err1, data){
				if (!data || ((new Date()-Date.parse(data.date))/1000) > 180 || data.active) {
					// Tạo mã OTP mới
					UserInfo.findOne({'id': client.UID}, 'red', function(err2, user){
						if (user) {
							let otp = (Math.random()*(9999-1000+1)+1000)>>0; // OTP từ 1000 đến 9999
							if (type == '1') {
								// App OTP
								telegram.findOne({'phone':check.phone}, 'form', function(err3, teleCheck){
									if (!!teleCheck) {
										OTP.create({'uid':client.UID, 'phone':check.phone, 'code':otp, 'date':new Date()});
										client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP đã được gửi tới Telegram của bạn.'}});
										client.redT.telegram.sendMessage(teleCheck.form, '*OTP*:  ' + otp + '', {parse_mode:'markdown', reply_markup:{remove_keyboard: true}});
									}else{
										client.red({notice:{title:'THẤT BẠI', text:'Bạn cần sử dụng Telegram để lấy OTP.'}});
									}
								});
							} else if (type == '2') {
								// SMS OTP
								if (user.red < 1000) {
									client.red({notice:{title:'THẤT BẠI', text:'Số dư trong tài khoản không đủ để lấy OTP.'}});
								}else{
									// Lấy SMS OTP
									user.red -= 1000;
									user.save();

									smsOTP(check.region+check.phone, otp);

									OTP.create({'uid':client.UID, 'phone':check.phone, 'code':otp, 'date':new Date()});
									client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP được gửi tới số điện thoại của bạn.'}, user:{red:user.red}});
								}
							}
						}
					});
				}else{
					client.red({notice:{title:'OTP', text:'Vui lòng kiểm tra hòm thư đến.!'}});
				}
			});
		}else{
			client.red({notice:{title:'THÔNG BÁO', text:'Bạn cần kích hoạt số điện thoại để sử dụng chức năng này.', button: {text: 'KÍCH HOẠT', type: 'reg_otp'}}});
		}
	});
}

module.exports = function(client, data){
	if (!!data.type){
		createOTP(client, data.type);
	}
}
