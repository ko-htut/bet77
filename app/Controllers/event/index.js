
var taixiu     = require('./taixiu/index');

module.exports = function(client, data){
	if (!!data.taixiu) {
		taixiu(client, data.taixiu);
	}
};
