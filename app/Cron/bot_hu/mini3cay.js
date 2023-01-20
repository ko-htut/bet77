
let HU            = require('../../Models/HU');
let Helpers       = require('../../Helpers/Helpers');
let base_card     = require('../../../data/card');

let spin = function(io, user){
	let cuoc = 100;
	let a = Math.floor(Math.random()*16);

	if (a == 15) {
		//  14
		cuoc = 10000;
	}else if (a >= 11 && a < 15) {
		//  10 11 12 13
		cuoc = 1000;
	}else{
		// 0 1 2 3 4 5 6 7 8 9
		cuoc = 100;
	}
	let addQuy = Math.floor(cuoc*0.01);
	// Sử lý bài
	let an      = 0;
	let card    = [...base_card.card]
		.slice(0, 36);

	card = Helpers.shuffle(card); // tráo bài lần 1

	let ketqua = card.slice(3, 6); // bốc 3 thẻ đầu tiên

	let arrT   = [];           // Mảng lọc các bộ 2 trong bài
	for (let i = 0; i < 3; i++) {
		let dataT = ketqua[i];
		if (void 0 === arrT[dataT.card]) {
			arrT[dataT.card] = 1;
		}else{
			arrT[dataT.card] += 1;
		}
	}

	let bo3     = false; // bộ ba (Kết quả có phải là bộ 3?)
	let bo3_a   = null;  // Tên bộ 3

	arrT.forEach(function(c, index) {
		if (c === 3) {
			bo3   = true;
			bo3_a = index;
		}
	});

	let type     = ketqua[0].type;                                     // Lấy ra chất đầu tiên trong bài
	let dongChat = ketqua.filter(type_card => type_card.type == type); // Lọc đồng chất
	dongChat     = dongChat.length == 3 ? true : false;                // Dây là đồng chất

	let LienTiep   = ketqua.sort(function(a,b){return a.card - b.card});
	let Day        = LienTiep[2].card - LienTiep[0].card === 2 && LienTiep[2].card != LienTiep[1].card && LienTiep[1].card != LienTiep[0].card ? true : false; // Bộ liên tiếp

	// Kết thúc Sử lý bài

	// Kiểm tra kết quả
	HU.findOne({game:'mini3cay', type:cuoc, red:true}, {}, function(err, data){
		let huUpdate = {bet:addQuy};
		if (bo3 && bo3_a === 0) {
			// NỔ HŨ
			HU.updateOne({game:'mini3cay', type:cuoc, red:true}, {$set:{name:'', bet:data.min}}).exec();
			an = Math.floor(data.bet-Math.ceil(data.bet*2/100));
			io.sendInHome({pushnohu:{title:'MINI 3 CÂY', name:user.name, bet:an}});
		}else if (Day && dongChat) {
			an = cuoc*30;
			io.sendInHome({news:{t:{game:'MINI 3 CÂY', users:user.name, bet:an, status:2}}});
		}else if (bo3) {
			an = cuoc*20;
			io.sendInHome({news:{t:{game:'MINI 3 CÂY', users:user.name, bet:an, status:2}}});
		}
		HU.updateOne({game:'mini3cay', type:cuoc, red:true}, {$inc:huUpdate}).exec();

		io = null;
		user = null;
		cuoc = null;
		a = null;
		addQuy = null;
		an      = null;
		card    = null;
		ketqua = null;
		arrT   = null;
		bo3     = null;
		bo3_a   = null;
		type     = null;
		dongChat = null;
		LienTiep = null;
		Day = null;
		huUpdate = null;
	});
}

module.exports = function(io, listBot){
	if (listBot.length) {
		let max = Math.floor(listBot.length*17/100);
		listBot = Helpers.shuffle(listBot);
		listBot = listBot.slice(0, max);
		listBot.forEach(function(user) {
			spin(io, user);
		});
		io = null;
		listBot = null;
	}
};
