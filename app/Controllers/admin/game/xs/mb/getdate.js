
let xsmb = require('../../../../../Models/XoSo/mb/xsmb');

module.exports = function(client, date) {
	if (!!date) {
		xsmb.findOne({date:date}, {}, function(err, result) {
			if (!!result) {
				result = result._doc;
				client.red({xs:{mb:{kq:{date:result}}}});
			}
		});
	}
}
