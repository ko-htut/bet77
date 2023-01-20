
var nap_the    = require('./shop/nap_the');
var mua_the    = require('./shop/mua_the');
var mua_xu     = require('./shop/mua_xu.js');
var chuyen_red = require('./shop/chuyen_red');
var get_daily  = require('./shop/get_daily');

var info_thanhtoan = require('./shop/info_thanhtoan');

var bank    = require('./shop/bank');


module.exports = function(client, data){
	if (!!data) {
		if (!!data.nap_the) {
			nap_the(client, data.nap_the);
		}
		if (!!data.mua_the) {
			mua_the(client, data.mua_the);
		}
		if (!!data.mua_xu) {
			mua_xu(client, data.mua_xu);
		}
		if (!!data.chuyen_red) {
			chuyen_red(client, data.chuyen_red);
		}
		if (!!data.get_daily) {
			get_daily(client);
		}
		if (void 0 !== data.info_nap) {
			info_thanhtoan(client, 1);
		}
		if (void 0 !== data.info_mua) {
			info_thanhtoan(client);
		}

		if (!!data.bank) {
			bank(client, data.bank);
		}
	}
}
