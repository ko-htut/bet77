
var BauCua_phien = require('../../../Models/BauCua/BauCua_phien');
var BauCua_temp  = require('../../../Models/BauCua/BauCua_temp');

module.exports = function(client){
	var LinhVat = {};
	var data    = JSON.parse(JSON.stringify(client.redT.baucua.info));;

	var dataMeXu = [
		'meXuHuou',
		'meXuBau',
		'meXuGa',
		'meXuCa',
		'meXuCua',
		'meXuTom',
	];
	var dataMeRed = [
		'meRedHuou',
		'meRedBau',
		'meRedGa',
		'meRedCa',
		'meRedCua',
		'meRedTom',
	];

	var active1 = Promise.all(client.redT.baucua.ingame.map(function(user){
		if (user.uid == client.UID) {
			if (user.red) {
				return Promise.all(dataMeRed.map(function(tab, i){
					return (data[tab] = user[i]);
				}))
			}else{
				return Promise.all(dataMeXu.map(function(tab, i){
					return (data[tab] = user[i]);
				}))
			}
		}
	}));

	var active2 = new Promise((a, b)=>{
		BauCua_temp.findOne({}, {}, function(err, temp){
			Promise.all(dataMeRed.map(function(tab, i){
				return (LinhVat[i] = temp[i]);
			}))
			.then(Results => {
				a(Results)
			})
		})
	})

	var active3 = new Promise((resolve, reject) => {
		BauCua_phien.find({}, {}, {sort:{'_id':-1}, limit: 10}, function(err, post) {
			Promise.all(post.map(function(obj){return [obj.dice1,obj.dice2,obj.dice3]}))
			.then(function(arrayOfResults) {
				resolve(arrayOfResults)
			})
		});
	});
	Promise.all([active1, active2, active3])
	.then(result => {
		client.red({mini:{baucua:{regOpen: true, data: data, logLV: LinhVat, logs: result[2]}}});
	});
}
