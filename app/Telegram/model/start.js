
let telegram = require('../../Models/Telegram');

module.exports = function(bot, id) {
	telegram.findOne({'form':id}, 'phone', function(err, data){
		if (data) {
			let opts = {
				parse_mode: 'markdown',
			    reply_markup: {
				    remove_keyboard: true,
			    }
			};
			bot.sendMessage(id, '*HƯỚNG DẪN*' + '\n\n' + 'Nhập:' + '\n' + '*OTP*:           Lấy mã OTP miễn phí.' + '\n' + '*GiftCode*:  Nhận ngay GiftCode khởi nghiệp.', opts);
		}else{
			let opts = {
				parse_mode: 'markdown',
			    reply_markup: {
			      	keyboard: [
				        [{text: 'CHIA SẺ SỐ ĐIỆN THOẠI', request_contact: true}],
				    ],
				    resize_keyboard: true,
			    }
			};
			bot.sendMessage(id, '*Bem68.Com*  Đây là lần đầu tiên bạn sử dụng App OTP. Vui lòng ấn CHIA SẺ SỐ ĐIỆN THOẠI để lấy mã OTP miễn phí.', opts);
		}
	});
}
