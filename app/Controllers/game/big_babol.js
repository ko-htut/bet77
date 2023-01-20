
var spin = require('./big_babol/spin');
var log  = require('./big_babol/log');
var top  = require('./big_babol/top');

module.exports = function(client, data){
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
