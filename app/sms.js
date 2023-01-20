
/**
 * SMS Controller
 */

let request = require('request');
let config  = require('../config/sms');

let sendOTP = function(phone, otp){
	let form = {
		  'source': 'Verify',
		  'destination': phone,
		  'text': 'Verification Code: ' + otp,
		  'encoding': 'AUTO',
	};
	request.post({
		url: config.URL,
		headers: {'Authorization':'Bearer ' + config.Author, 'Content-Type': 'application/json'},
		json: form,
	});
}

module.exports = {
	sendOTP: sendOTP,
}
