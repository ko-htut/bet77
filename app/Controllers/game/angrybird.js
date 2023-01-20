
var spin = require('./angrybird/spin');
var log  = require('./angrybird/log');
var top  = require('./angrybird/top');

module.exports = function(client, data){
	if (!!data.spin) {
		spin(client, data.spin);
	}
	if (!!data.log) {
		log(client, data.log)
	}
	if (void 0 !== data.top) {
		top(client, data.top)
	}
};
