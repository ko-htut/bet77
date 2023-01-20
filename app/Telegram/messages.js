
let start   = require('./model/start');
let otp     = require('./model/otp');
let contact = require('./model/contact');

module.exports = function(bot, msg) {
	let text = msg.text;
	if(/^otp$/i.test(text)){
		otp(bot, msg.from.id);
	}else if(/^giftcode$/i.test(text)){
		// GiftCode
	}else if(msg.contact){
		contact(bot, msg.from.id, msg.contact.phone_number);
	}else{
		start(bot, msg.from.id);
	}
}
