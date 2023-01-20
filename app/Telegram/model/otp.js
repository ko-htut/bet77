
let telegram = require('../../Models/Telegram');
let OTP      = require('../../Models/OTP');
let Phone    = require('../../Models/Phone');

module.exports = function(bot, id) {
	telegram.findOne({'form':id}, 'phone', function(err, check){
		if (check) {
			Phone.findOne({'phone':check.phone}, {}, function(err3, checkPhone){
				if (checkPhone) {
					OTP.findOne({'uid':checkPhone.uid, 'phone':checkPhone.phone}, {}, {sort:{'_id':-1}}, function(err, data){
						if (!data || ((new Date()-Date.parse(data.date))/1000) > 180 || data.active) {
							// Tạo mã OTP mới
							var otp = (Math.random()*(9999-1000+1)+1000)>>0; // OTP từ 1000 đến 9999
							OTP.create({'uid':checkPhone.uid, 'phone':checkPhone.phone, 'code':otp, 'date':new Date()});
							bot.sendMessage(id, '*OTP*:  ' + otp + '', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
						}else{
							bot.sendMessage(id, 'OTP:  _' + data.code + '_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
						}
					});
				}else{
					bot.sendMessage(id, '_Thao tác thất bại, không thể đọc số điện thoại_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
				}
			});
		}else{
			bot.sendMessage(id, '_Thao tác thất bại, không thể đọc số điện thoại_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
		}
	});
}
