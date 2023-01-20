
const spin  = require('./candy/spin');
const bonus = require('./candy/bonus');
const log   = require('./candy/log');
const top   = require('./candy/top');

module.exports = function(client, data){
	if (!!data.bonus) {
		bonus(client, data.bonus)
	}
	if (!!data.spin) {
		spin(client, data.spin)
	}
	if (!!data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
};
