
let XocXoc_cuoc = require('../../../Models/XocXoc/XocXoc_cuoc');
let UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client, data){
	if (!!data.cuoc && !!data.box) {
		let cuoc = data.cuoc>>0;
		let red  = !!data.red;
		let box  = data.box;

		if (client.redT.game.xocxoc.time < 2 || client.redT.game.xocxoc.time > 30) {
			client.red({xocxoc:{notice: 'Vui lòng cược ở phiên sau.!!'}});
			return;
		}

		if (!(cuoc === 1000 || cuoc === 10000 || cuoc === 50000 || cuoc === 100000 || cuoc === 1000000) ||
			!(box === 'chan' || box === 'le' || box === 'red3' || box === 'red4' || box === 'white3' || box === 'white4')) {
			client.red({mini:{XocXoc:{notice: 'Cược thất bại...'}}});
		}else{
			UserInfo.findOne({id:client.UID}, 'red xu', function(err, user){
				if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
					client.red({xocxoc:{notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để cược.!!'}});
				}else{
					if(red){
						user.red -= cuoc;
					}else{
						user.xu  -= cuoc;
					}
					user.save();

					let xocxoc = client.redT.game.xocxoc;

					xocxoc.chip[box][cuoc] += 1;

					XocXoc_cuoc.findOne({uid:client.UID, phien:xocxoc.phien, red:red}, function(err, checkOne) {
						if (checkOne){
							checkOne[box] += cuoc;
							checkOne.save();
						}else{
							var create = {uid:client.UID,name: client.profile.name, phien:xocxoc.phien, red:red, time: new Date()};
							create[box] = cuoc;
							XocXoc_cuoc.create(create);
						}

						let newData = {
							'chan':   0,
							'le':     0,
							'red3':   0,
							'red4':   0,
							'white3': 0,
							'white4': 0,
						};
						newData[box] = cuoc;
						let me_cuoc = {};
						if (red) {
							xocxoc.data.red[box] += cuoc;
							xocxoc.dataAdmin.red[box] += cuoc;
							if (xocxoc.ingame.red[client.profile.name]) {
								xocxoc.ingame.red[client.profile.name][box] += cuoc;
							}else{
								xocxoc.ingame.red[client.profile.name] = newData;
							}
							me_cuoc.red = xocxoc.ingame.red[client.profile.name];
						}else{
							xocxoc.data.xu[box] += cuoc;
							xocxoc.dataAdmin.xu[box] += cuoc;
							if (xocxoc.ingame.xu[client.profile.name]) {
								xocxoc.ingame.xu[client.profile.name][box] += cuoc;
							}else{
								xocxoc.ingame.xu[client.profile.name] = newData;
							}
							me_cuoc.xu = xocxoc.ingame.xu[client.profile.name];
						}
						Object.values(xocxoc.clients).forEach(function(users){
							if (client !== users) {
								users.red({xocxoc:{chip:{box:box, cuoc:cuoc}}});
							}else{
								users.red({xocxoc:{mechip:{box:box, cuoc:data.cuoc}, me:me_cuoc}, user:{red:user.red, xu:user.xu}});
							}
						});

						xocxoc  = null;
						me_cuoc = null;
						newData = null;
						client  = null;
						data    = null;

						cuoc = null;
						red  = null;
						box  = null;
					})
				}
			});
		}
	}
};
