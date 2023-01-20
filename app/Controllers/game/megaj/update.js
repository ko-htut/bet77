
let MegaJP_user = require('../../../Models/MegaJP/MegaJP_user');

module.exports = function(client){
	MegaJP_user.findOne({uid:client.UID}, {}, function(err, dataJP){
		if (!!dataJP) {
			client.red({mini:{megaj:{info:{100:dataJP[100], 1000:dataJP[1000], 10000:dataJP[10000]}}}});
		}
	});
};
