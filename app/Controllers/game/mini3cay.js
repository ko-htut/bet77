
let spin = require('./mini3cay/spin');
let logs = require('./mini3cay/logs');
let tops = require('./mini3cay/tops');

module.exports = function(client, data){
	if (!!data.spin) {
		spin(client, data.spin)
	}
	if (!!data.logs) {
		logs(client, data.logs)
	}
	if (void 0 !== data.tops) {
		tops(client, data.tops)
	}
};
