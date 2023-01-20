
var BauCua_cuoc = require('../../../Models/BauCua/BauCua_cuoc');
var UserInfo    = require('../../../Models/UserInfo');

module.exports = function(client, data){
	if (!!data && !!data.cuoc) {
		var cuoc    = data.cuoc>>0;
		var red     = !!data.red;
		var linhVat = data.linhVat>>0;

		if (client.redT.BauCua_time < 2 || client.redT.BauCua_time > 60) {
			client.red({mini:{baucua:{notice: 'Vui lòng cược ở phiên sau.!!'}}});
			return;
		}

		if (cuoc < 100 || linhVat < 0 || linhVat > 5) {
			client.red({mini:{baucua:{notice: 'Cược thất bại...'}}});
		}else{
			UserInfo.findOne({id: client.UID}, 'red xu', function(err, user){
				if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
					client.red({mini:{baucua:{notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để cược.!!'}}});
				}else{
					if(red){
						user.red -= cuoc;
					}else{
						user.xu  -= cuoc;
					}
					user.save();

					var dataXu = [
						'meXuHuou',
						'meXuBau',
						'meXuGa',
						'meXuCa',
						'meXuCua',
						'meXuTom',
					]
					var dataRed = [
						'meRedHuou',
						'meRedBau',
						'meRedGa',
						'meRedCa',
						'meRedCua',
						'meRedTom',
					]
					var tab = red ? dataRed : dataXu;
					var data = {};
					BauCua_cuoc.findOne({uid: client.UID, phien: client.redT.BauCua_phien, red:red}, function(err, checkOne) {
						var io = client.redT;
						if (red) {
							if (linhVat == 0) {
								io.baucua.info.redHuou += cuoc;
								io.baucua.infoAdmin.redHuou += cuoc;
							}else if (linhVat == 1) {
								io.baucua.info.redBau += cuoc;
								io.baucua.infoAdmin.redBau += cuoc;
							}else if (linhVat == 2) {
								io.baucua.info.redGa += cuoc;
								io.baucua.infoAdmin.redGa += cuoc;
							}else if (linhVat == 3) {
								io.baucua.info.redCa += cuoc;
								io.baucua.infoAdmin.redCa += cuoc;
							}else if (linhVat == 4) {
								io.baucua.info.redCua += cuoc;
								io.baucua.infoAdmin.redCua += cuoc;
							}else if (linhVat == 5) {
								io.baucua.info.redTom += cuoc;
								io.baucua.infoAdmin.redTom += cuoc;
							}
						}else{
							if (linhVat == 0) {
								io.baucua.info.xuHuou += cuoc;
								io.baucua.infoAdmin.xuHuou += cuoc;
							}else if (linhVat == 1) {
								io.baucua.info.xuBau += cuoc;
								io.baucua.infoAdmin.xuBau += cuoc;
							}else if (linhVat == 2) {
								io.baucua.info.xuGa += cuoc;
								io.baucua.infoAdmin.xuGa += cuoc;
							}else if (linhVat == 3) {
								io.baucua.info.xuCa += cuoc;
								io.baucua.infoAdmin.xuCa += cuoc;
							}else if (linhVat == 4) {
								io.baucua.info.xuCua += cuoc;
								io.baucua.infoAdmin.xuCua += cuoc;
							}else if (linhVat == 5) {
								io.baucua.info.xuTom += cuoc;
								io.baucua.infoAdmin.xuTom += cuoc;
							}
						}
						if (checkOne){
							var update = {};
							update[linhVat] = cuoc;
							BauCua_cuoc.findOneAndUpdate({uid: client.UID, phien: client.redT.BauCua_phien, red:red}, {$inc:update}, function (err, cat){
								Promise.all(tab.map(function(o, i){
									data[o] = cat[i] + (i == linhVat ? cuoc : 0);
									return (data[o] = cat[i] + (i == linhVat ? cuoc : 0));
								}))
								.then(result => {
									var dataT = {mini:{baucua:{data: data}}, user:{red: user.red, xu:user.xu}};
									Promise.all(client.redT.users[client.UID].map(function(obj){
										obj.red(dataT);
									}));
								})
							});

							Promise.all(io.baucua.ingame.map(function(uOld){
								if (uOld.uid == client.UID && uOld.red == red) {
									uOld[linhVat] += cuoc;
								}
							}));
						}else{
							var create = {uid: client.UID, name: client.profile.name, phien: client.redT.BauCua_phien, red:red, time: new Date()};
							create[linhVat] = cuoc;
							BauCua_cuoc.create(create);
							data[tab[linhVat]] = cuoc;
							var dataT = {mini:{baucua:{data: data}}, user:{red: user.red, xu:user.xu}};
							Promise.all(client.redT.users[client.UID].map(function(obj){
								obj.red(dataT);
							}));

							var addList = {uid:client.UID, name:client.profile.name, red:red, '0':0, '1':0, '2':0, '3':0, '4':0, '5':0};
							addList[linhVat] = cuoc;
							io.baucua.ingame.unshift(addList);
						}
					})
				}
			});
		}
	}
};
