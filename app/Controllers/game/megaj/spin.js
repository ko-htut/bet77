
//let HU          = require('../../../Models/HU');

let MegaJP_user = require('../../../Models/MegaJP/MegaJP_user');
let MegaJP_spin = require('../../../Models/MegaJP/MegaJP_spin');

let UserInfo    = require('../../../Models/UserInfo');

let megaData    = require('../../../../data/megajackpot');

function random(){
	let a = (Math.random()*32)>>0;
	if (a === 31) {
		return 4; // x 1500
	}else if (a >= 28 && a < 31) {
		return 5; // free
	}else if (a >= 24 && a < 28) {
		return 3; // x1000
	}else if (a >= 18 && a < 24) {
		return 2; // x500
	}else{
		return 1; // x250
	}
}

module.exports = function(client, game){
	game = game>>0;
	if (game === 100 || game === 1000 || game === 10000) {
		MegaJP_user.findOne({uid:client.UID}, {}, function(err, dataJP){
			if (!!dataJP && dataJP[game] > 0) {
				let kq     = random();
				let dataKQ = megaData[game][kq];
				if (kq !== 5) {
					// cộng tiền
					dataJP[game] -= 1;
					dataJP.save();
					UserInfo.updateOne({id:client.UID},{$inc:{red:dataKQ.thuong}}).exec();
				}
				// Quay
				MegaJP_spin.create({name:client.profile.name, room:game, kq:kq, win:dataKQ.thuong, time:new Date()});
				client.red({mini:{megaj:{status:{status:true, data:dataKQ, kq:kq, game:game}, info:{100:dataJP[100], 1000:dataJP[1000], 10000:dataJP[10000]}}}});
			}else{
				client.red({mini:{megaj:{status:{status:false}, notice:'Bạn không có lượt quay nào.!!'}}});
			}
		});
	}else{
		client.red({mini:{megaj:{status:{status:false}, notice:'Dữ liệu không đúng.!!'}}});
	}
};
