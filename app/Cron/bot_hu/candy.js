
let HU      = require('../../Models/HU');
let Helpers = require('../../Helpers/Helpers');

let random_cel2 = function(){
	let a = Math.floor(Math.random()*28);
	if (a == 27) {
		// 27
		return 6;
	}else if (a >= 25 && a < 27) {
		// 25 26
		return 5;
	}else if (a >= 22 && a < 25) {
		// 22 23 24
		return 4;
	}else if (a >= 18 && a < 22) {
		// 18 19 20 21
		return 3;
	}else if (a >= 13 && a < 18) {
		// 13 14 15 16 17
		return 2;
	}else if (a >= 7 && a < 13) {
		// 7 8 9 10 11 12
		return 1;
	}else{
		// 0 1 2 3 4 5 6   
		return 0;
	}
}

let check_win = function(data, line){
	let win_icon = 0;
	let number_win = null;
	let arrT   = [];           // Mảng lọc các bộ
	for (let i = 0; i < 5; i++) {
		let dataT = data[i];
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}

	arrT.forEach(function(c, index) {
		if (c === 5) {
			win_icon = index;
			number_win = 5;
		}
		if (c === 4) {
			win_icon = index;
			number_win = 4;
		}
		if (c === 3) {
			win_icon = index;
			number_win = 3;
		}
	});

	data = null;
	arrT= null;
	return {line:line, win:win_icon, type:number_win};

	/**
	return Promise.all(arrT.map(function(c, index){
		if (c === 5) {
			win_icon = index;
			number_win = 5;
		}
		if (c === 4) {
			win_icon = index;
			number_win = 4;
		}
		if (c === 3) {
			win_icon = index;
			number_win = 3;
		}
		return void 0;
	})).then(result => {
		result = null;
		data = null;
		arrT= null;
		return {line:line, win:win_icon, type:number_win};
	})
	*/
}

let spin = function(io, user){
	let bet = 100;

	let line = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

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

	let tongCuoc = bet*line.length;  // Tiền cược
	let addQuy = Math.floor(tongCuoc*0.005);

	let bet_win   = 0;
	let nohu      = false;
	// tạo kết quả
	HU.findOne({game:'candy', type:bet, red:true}, {}, function(err2, dataHu){
		let huUpdate   = {bet:addQuy};

		let aRwin = Math.floor(Math.random()*16);
		let celSS = [];

		if (aRwin == 15) {
			// no hu
			celSS = [
				random_cel2(), random_cel2(), random_cel2(),
				random_cel2(), random_cel2(), random_cel2(),
				6,             6,             6,
				2,             1,             1,
				0,             0,             0,
			];
		}else{
			// kho
			celSS = [
				random_cel2(), random_cel2(), random_cel2(),
				random_cel2(), random_cel2(), 6,
				4,             3,             5,
				2,             1,             1,
				0,             0,             0,
			];
		}

		celSS = Helpers.shuffle(celSS);

		let cel1 = [celSS[0],  celSS[1],  celSS[2]];  // Cột 1
		let cel2 = [celSS[3],  celSS[4],  celSS[5]];  // Cột 2
		let cel3 = [celSS[6],  celSS[7],  celSS[8]];  // Cột 3
		let cel4 = [celSS[9],  celSS[10], celSS[11]]; // Cột 4
		let cel5 = [celSS[12], celSS[13], celSS[14]]; // Cột 5

		// kiểm tra kết quả
		Promise.all(line.map(function(selectLine){
			switch(selectLine){
				case 1:
					return check_win([cel1[1], cel2[1], cel3[1], cel4[1], cel5[1]], selectLine);
					break;

				case 2:
					return check_win([cel1[0], cel2[0], cel3[0], cel4[0], cel5[0]], selectLine);
					break;

				case 3:
					return check_win([cel1[2], cel2[2], cel3[2], cel4[2], cel5[2]], selectLine);
					break;

				case 4:
					return check_win([cel1[1], cel2[1], cel3[0], cel4[1], cel5[1]], selectLine);
					break;

				case 5:
					return check_win([cel1[1], cel2[1], cel3[2], cel4[1], cel5[1]], selectLine);
					break;

				case 6:
					return check_win([cel1[0], cel2[0], cel3[1], cel4[0], cel5[0]], selectLine);
					break;

				case 7:
					return check_win([cel1[2], cel2[2], cel3[1], cel4[2], cel5[2]], selectLine);
					break;

				case 8:
					return check_win([cel1[0], cel2[2], cel3[0], cel4[2], cel5[0]], selectLine);
					break;

				case 9:
					return check_win([cel1[2], cel2[0], cel3[2], cel4[0], cel5[2]], selectLine);
					break;

				case 10:
					return check_win([cel1[1], cel2[0], cel3[2], cel4[0], cel5[1]], selectLine);
					break;

				case 11:
					return check_win([cel1[2], cel2[1], cel3[0], cel4[1], cel5[2]], selectLine);
					break;

				case 12:
					return check_win([cel1[0], cel2[1], cel3[2], cel4[1], cel5[0]], selectLine);
					break;

				case 13:
					return check_win([cel1[1], cel2[2], cel3[1], cel4[0], cel5[1]], selectLine);
					break;

				case 14:
					return check_win([cel1[1], cel2[0], cel3[1], cel4[2], cel5[1]], selectLine);
					break;

				case 15:
					return check_win([cel1[2], cel2[1], cel3[1], cel4[1], cel5[2]], selectLine);
					break;

				case 16:
					return check_win([cel1[0], cel2[1], cel3[1], cel4[1], cel5[0]], selectLine);
					break;

				case 17:
					return check_win([cel1[1], cel2[2], cel3[2], cel4[2], cel5[1]], selectLine);
					break;

				case 18:
					return check_win([cel1[1], cel2[0], cel3[0], cel4[0], cel5[1]], selectLine);
					break;

				case 19:
					return check_win([cel1[2], cel2[2], cel3[1], cel4[0], cel5[0]], selectLine);
					break;

				case 20:
					return check_win([cel1[0], cel2[0], cel3[1], cel4[2], cel5[2]], selectLine);
					break;
			}
		}))
		.then(result => {
			line = null;
			result.forEach(function(line_win) {
				if (line_win.win == 6) {
					if (line_win.type === 5) {
						// Nổ Hũ
						let okHu = 0;
						if (!nohu) {
							okHu = Math.floor(dataHu.bet-Math.ceil(dataHu.bet*2/100));
							bet_win += okHu;
							HU.updateOne({game:'candy', type:bet, red:true}, {$set:{name:'', bet:dataHu.min}}).exec();
						}else{
							okHu = Math.floor(dataHu.min-Math.ceil(dataHu.min*2/100));
							bet_win += okHu;
						}
						io.sendInHome({pushnohu:{title:'Candy', name:user.name, bet:okHu}});
						nohu = true;
					}
				}else if(!nohu && line_win.win == 5) {
					if (line_win.type === 5) {
						// x5000
						bet_win += bet*5000;
					}else if (line_win.type === 4){
						// x25
						bet_win += bet*30;
					}
				}else if(!nohu && line_win.win == 3) {
					if (line_win.type === 5) {
						// x1000
						bet_win += bet*1000;
					}else if (line_win.type === 4){
						// x20
						bet_win += bet*20;
					}
				}else if(!nohu && line_win.win == 2) {
					if (line_win.type === 5) {
						// x200
						bet_win += bet*200;
					}else if (line_win.type === 4){
						// x15
						bet_win += bet*15;
					}else if (line_win.type === 3){
						// x3
						bet_win += bet*3;
					}
				}else if(!nohu && line_win.win == 1) {
					if (line_win.type === 5) {
						// x80
						bet_win += bet*80;
					}else if (line_win.type === 4){
						// x10
						bet_win += bet*10;
					}
				}else if(!nohu && line_win.win == 0) {
					if (line_win.type === 5) {
						// x20
						bet_win += bet*20;
					}else if (line_win.type === 4){
						// x6
						bet_win += bet*6;
					}else if (line_win.type === 3){
						// x2
						bet_win += bet*2;
					}
				}
			});
			if (!nohu && bet_win >= tongCuoc*2.24) {
				io.sendInHome({news:{t:{game:'Candy', users:user.name, bet:bet_win, status:2}}});
			}
			HU.updateOne({game:'candy', type:bet, red:true}, {$inc:huUpdate}).exec();

			io = null
			user = null;
			bet = null;
			a = null;
			tongCuoc = null;
			addQuy = null;
			bet_win  = null;
			nohu     = null;
			huUpdate = null;
			aRwin = null;
			celSS = null;
			cel1 = null;
			cel2 = null;
			cel3 = null;
			cel4 = null;
			cel5 = null;
		})
	})
}

module.exports = function(io, listBot){
	if (listBot.length) {
		let max = Math.floor(listBot.length*5/100);
		listBot = Helpers.shuffle(listBot);
		listBot = listBot.slice(0, max);
		listBot.forEach(function(user) {
			spin(io, user);
		});
		io = null;
		listBot = null;
	}
};
