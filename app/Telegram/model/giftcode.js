
let shortid  = require('shortid');
let telegram = require('../../Models/Telegram');
let Phone    = require('../../Models/Phone');
let GiftCode = require('../../Models/GiftCode');

module.exports = function(bot, id) {
	telegram.findOne({'form':id}, {}, function(err1, check){
		if (check) {
			Phone.findOne({'phone':check.phone}, {}, function(err2, checkPhone){
				if (checkPhone) {
					if (!check.gift) {
						// Gift khởi nghiệp
						let get_gift = shortid.generate();
						try {
							GiftCode.create({'code':get_gift, 'red':10000, 'date':new Date(), 'todate':new Date(new Date()*1+86400000), 'to':checkPhone.uid}, function(err3, gift){
								if (!!gift){
									if (!check.gift){
										check.gift = true;
										check.save();
										bot.sendMessage(id, 'Chúc mừng bạn đã nhận Giftcode khởi nghiệp, mã Giftcode của bạn là: ' + get_gift, {reply_markup:{remove_keyboard:true}});
									}else{
										bot.sendMessage(id, 'Chúc mừng bạn đã nhận Giftcode điểm danh đăng nhập hằng ngày, mã Giftcode của bạn là: ' + get_gift, {reply_markup:{remove_keyboard:true}});
									}
								}else{
									bot.sendMessage(id, '_Hãy quay lại vào ngày hôm sau._', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
								}
							});
						} catch (error) {
							bot.sendMessage(id, '_Hãy quay lại vào ngày hôm sau._', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
						}
					}else{
						bot.sendMessage(id, '_Hãy quay lại vào ngày hôm sau._', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
					}
				}else{
					bot.sendMessage(id, '_Thao tác thất bại, không thể đọc số điện thoại_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
				}
			});
		}else{
			bot.sendMessage(id, '_Thao tác thất bại, không thể đọc số điện thoại_', {parse_mode:'markdown', reply_markup:{remove_keyboard:true}});
		}
	});
}
