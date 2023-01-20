
let HU             = require('../../Models/HU');
let Helpers        = require('../../Helpers/Helpers');

let base_card      = require('../../../data/card');

let spin = function(io, user){
	let bet = 100;

	let a = Math.floor(Math.random()*16);

	if (a == 15) {
		//  14
		bet = 10000;
	}else if (a >= 11 && a < 15) {
		//  10 11 12 13
		bet = 1000;
	}else{
		// 0 1 2 3 4 5 6 7 8 9
		bet = 100;
	}

	let addQuy = Math.floor(bet*0.01);
	let an     = 0;
	let card   = [...base_card.card];

	// tráo bài
	card = Helpers.shuffle(card); // tráo bài lần 1

	let ketqua = card.slice(0, 5); // bốc 5 thẻ đầu tiên

	let arrT   = [];           // Mảng chứa các bộ (Đôi, Ba, Bốn) trong bài
	for (let i = 0; i < 5; i++) {
		let dataT = ketqua[i];
		if (void 0 === arrT[dataT.card]) {
			arrT[dataT.card] = 1;
		}else{
			arrT[dataT.card] += 1;
		}
	}

	let tuQuy   = null;  // Tên bộ tứ
	let bo2     = 0;     // bộ 2 (có bao nhiêu 2)
	let bo2_a   = [];    // Danh sách tên bộ 2
	let bo3     = false; // bộ ba (có bao nhiêu bộ 3)
	let bo3_a   = null;  // Tên bộ 3

	arrT.forEach(function(c, index) {
		if (c === 4) {
			tuQuy = index;
		}
		if (c === 3) {
			bo3   = true;
			bo3_a = index;
		}
		if (c === 2) {
			bo2++;
			bo2_a[bo2_a.length] = index;
		}
	});

	let type     = ketqua[0].type; // chất đầu tiên
	let dongChat = ketqua.filter(type_card => type_card.type == type); // Kiểm tra đồng chất
	dongChat     = dongChat.length == 5 ? true : false;  // Dây là đồng chất

	let AK    = ketqua.sort(function(a, b){return a.card - b.card}); // sắp sếp từ A đến K (A23...JQK)
	let isDay = false; // là 1 dây
	if (bo3 == false && bo2 == 0 && tuQuy == null) {
		if (AK[4].card - AK[0].card === 4 && AK[0].card !== 0) {
			isDay = true;
		}else if (AK[4].card - AK[1].card === 3 && AK[0].card === 0 && AK[4].card === 12) {
			isDay = true;
		}
	}

	HU.findOne({game:'minipoker', type:bet, red:true}, 'name bet min toX balans x', function(err, dataHu){
		let huUpdate   = {bet:addQuy, toX:0, balans:0};

		let quyHu     = dataHu.bet;
		let quyMin    = dataHu.min;

		let toX       = dataHu.toX;
		let balans    = dataHu.balans;

		if (dongChat && isDay && AK[4].card > 9) {
			// NỔ HŨ (DÂY ĐỒNG CHẤT CỦA DÂY ĐẾN J TRỞ LÊN) Hoặc được xác định là nổ hũ
			if (toX > 0) {
				toX -= 1;
				huUpdate.toX -= 1;
			}else if (balans > 0) {
				balans -= 1;
				huUpdate.balans -= 1;
			}
			if (toX < 1 && balans > 0) {
				quyMin = quyMin*dataHu.x;
			}
			HU.updateOne({game:'minipoker', type:bet, red:true}, {$set:{name:'', bet:quyMin}}).exec();
			an   = Math.floor(quyHu-Math.ceil(quyHu*2/100));
			io.sendInHome({pushnohu:{title:'MINI POKER', name:user.name, bet:an}});
		}else if (isDay && dongChat) {
			// x1000    THÙNG PHÁ SẢNH (DÂY ĐỒNG CHẤT)
			an   = (bet*1000);
			io.sendInHome({news:{t:{game:'MINI POKER', users:user.name, bet:an, status:2}}});
		}else if (tuQuy != null) {
			// x150     TỨ QUÝ (TỨ QUÝ)
			an   = (bet*150);
			io.sendInHome({news:{t:{game:'MINI POKER', users:user.name, bet:an, status:2}}});
		}
		HU.updateOne({game:'minipoker', type:bet, red:true}, {$inc:huUpdate}).exec();


		huUpdate = null;
		quyHu    = null;
		quyMin   = null;
		toX      = null;
		balans   = null;
		io = null;
		user = null;
		bet = null;
		a = null;
		addQuy = null;
		an     = null;
		card   = null;
		ketqua = null;
		arrT   = null;
		tuQuy   = null;
		bo2     = null;
		bo2_a   = null;
		bo3     = null;
		bo3_a   = null;
		type     = null;
		dongChat = null;
		AK    = null;
		isDay = null;
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
