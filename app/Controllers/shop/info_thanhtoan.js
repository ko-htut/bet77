
var NhaMang = require('../../Models/NhaMang');
var MenhGia = require('../../Models/MenhGia');

module.exports = function(client, nap = false){
	if (!!nap) {
		var find = {nap: true};
	}else{
		var find = {mua: true};
	}
	var active1 = NhaMang.find(find).exec();
	var active2 = MenhGia.find(find).exec();

	Promise.all([active1, active2])
	.then(function(values){
		var data = {nhamang: values[0], menhgia: values[1]}
		if (!!nap) {
			client.red({shop:{nap_red: {info:data}}});
		}else{
			client.red({shop:{mua_the_nap: {info:data}}});
		}
	})
}
