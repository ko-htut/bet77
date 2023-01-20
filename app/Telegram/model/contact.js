
let telegram = require('../../Models/Telegram');
let Phone    = require('../../Models/Phone');
let helpers  = require('../../Helpers/Helpers');

module.exports = function(bot, id, contact) {
	let phoneCrack = helpers.phoneCrack(contact);
	if (phoneCrack) {
		Phone.findOne({'phone':phoneCrack.phone}, 'phone', function(err, check1){
			if (check1) {
				try {
					telegram.create({'form':id, 'phone':phoneCrack.phone}, function(err, cP){
						if (!!cP) {
							bot.sendMessage(id, '_Đăng nhập thành công_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
							bot.sendMessage(id, '*HƯỚNG DẪN*' + '\n\n' + 'Nhập:' + '\n' + '*OTP*:           Lấy mã OTP miễn phí.' + '\n' + '*GiftCode*:  Nhận ngay GiftCode khởi nghiệp.', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
						}else{
							bot.sendMessage(id, '_Thao tác thất bại_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
						}
					});
				} catch (error) {
					bot.sendMessage(id, '_Thao tác thất bại_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
				}
			}else{
				bot.sendMessage(id, 'Số điện thoại này chưa được đăng ký. Vui lòng đăng ký tại _Bem68.Com_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
			}
		});
	}
}
