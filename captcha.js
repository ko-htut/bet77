
let svgCaptcha = require('svg-captcha');
let svg2img    = require('svg2img');
let Create     = function(client, name){
	let captcha = svgCaptcha.create({background:'#FFFFFF', noise:0});
	svg2img(captcha.data, function(error, buffer) {
		client.captcha = captcha.text;
		let data = {};
		data['data'] = 'data:image/png;base64,' + buffer.toString('base64');
		data['name'] = name;
		client.red({captcha: data});
	});
}
module.exports = function(data){
	switch(data){
		case 'signUp':
			Create(this, 'signUp');
			break;

		case 'giftcode':
			Create(this, 'giftcode');
			break;

		case 'forgotpass':
			Create(this, 'forgotpass');
			break;

		case 'transfer':
			Create(this, 'transfer');
			break;

		case 'chargeCard':
			Create(this, 'chargeCard');
			break;

		case 'withdrawXu':
			Create(this, 'withdrawXu');
			break;

		case 'withdrawCard':
			Create(this, 'withdrawCard');
			break;
	}
}
