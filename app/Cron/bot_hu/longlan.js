
let HU      = require('../../Models/HU');
let Helpers = require('../../Helpers/Helpers');

let random_T1 = function(){
	let a = Math.floor(Math.random()*66);
	if (a == 65) {
		// 65
		return 10;
	}else if (a >= 63 && a < 65) {
		// 63 64
		return 9;
	}else if (a >= 60 && a < 63) {
		// 60 61 62
		return 8;
	}else if (a >= 56 && a < 60) {
		// 56 57 58 59
		return 7;
	}else if (a >= 51 && a < 56) {
		// 51 52 53 54 55
		return 6;
	}else if (a >= 45 && a < 51) {
		// 45 46 47 48 49 50
		return 5;
	}else if (a >= 38 && a < 45) {
		// 38 39 40 41 42 43 44
		return 4;
	}else if (a >= 30 && a < 38) {
		// 30 31 32 33 34 35 36 37
		return 3;
	}else if (a >= 21 && a < 30) {
		// 21 22 23 24 25 26 27 28 29
		return 2;
	}else if (a >= 11 && a < 21) {
		// 11 12 13 14 15 16 17 18 19 20
		return 1;
	}else{
		// 0 1 2 3 4 5 6 7 8 9 10
		return 0;
	}
}

let check_win = function(data, line){
	let win_icon = 0;
	let win_type = null;
	let thaythe  = 0;  // Thay Thế (WinD)
	let arrT     = []; // Mảng lọc các bộ

	for (let i = 0; i < 5; i++) {
		let dataT = data[i];
		if (dataT == 10) {
			++thaythe;
		}
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}

	arrT.forEach(function(c, index) {
		if (index != 7 && index != 8 && index != 10) {
			arrT[index] += thaythe;
		}
	});

	arrT = arrT.map(function(c, index){
		let X = 0;
		if (index == 10) {
			if (c == 2) {
				X = 8;
			}else if(c == 3){
				X = 50;
			}else if(c == 4){
				X = 1000;
			}else if(c == 5){
				X = 8000;
			}
		}else if (index == 9) {
			if (c == 2) {
				X = 4;
			}else if(c == 3){
				X = 25;
			}else if(c == 4){
				X = 100;
			}else if(c == 5){
				X = 5000;
			}
		}else if (index == 8) {
			if(c == 3){
				X = 75;
			}else if(c == 4){
				X = 150;
			}else if(c == 5){
				X = 450;
			}
		}else if (index == 7) {
			if(c == 3){
				X = 75;
			}else if(c == 4){
				X = 150;
			}else if(c == 5){
				X = 450;
			}
		}else if (index == 6) {
			if(c == 3){
				X = 20;
			}else if(c == 4){
				X = 75;
			}else if(c == 5){
				X = 500;
			}
		}else if (index == 5) {
			if(c == 3){
				X = 16;
			}else if(c == 4){
				X = 60;
			}else if(c == 5){
				X = 375;
			}
		}else if (index == 4) {
			if(c == 3){
				X = 12;
			}else if(c == 4){
				X = 45;
			}else if(c == 5){
				X = 275;
			}
		}else if (index == 3) {
			if(c == 3){
				X = 10;
			}else if(c == 4){
				X = 30;
			}else if(c == 5){
				X = 150;
			}
		}else if (index == 2) {
			if(c == 3){
				X = 5;
			}else if(c == 4){
				X = 25;
			}else if(c == 5){
				X = 50;
			}
		}else if (index == 1) {
			if(c == 3){
				X = 5;
			}else if(c == 4){
				X = 10;
			}else if(c == 5){
				X = 25;
			}
		}else if (index == 0) {
			if(c == 3){
				X = 2;
			}else if(c == 4){
				X = 5;
			}else if(c == 5){
				X = 10;
			}
		}
		return {icon:index, lanve:c, x:X};
	});
	arrT.sort(function(a, b){return b.x-a.x});
	let win = arrT[0];
	data = null;
	win_icon = null;
	win_type = null;
	thaythe  = null;
	arrT     = null;
	return {line:line, win:win.icon, type:win.lanve};
}

let spin = function(io, user){
	let bet = 100;
	let line = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

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
	HU.findOne({game:'long', type:bet, red:true}, {}, function(err2, dataHu){
		let aRwin = Math.floor(Math.random()*50);
		let celSS = [];

		if (aRwin == 49) {
			// no hu
			celSS = [
				random_T1(), random_T1(), random_T1(),
				random_T1(), random_T1(), 9,
				9, 9,           9,
				1, 1, random_T1(),
				0, 0, 0,
			];
		}else{
			// kho
			celSS = [
				random_T1(), random_T1(), random_T1(),
				8, 7, 7,
				8, random_T1(),           random_T1(),
				1, 1, 2,
				0, 0, 0,
			];
		}

		celSS = Helpers.shuffle(celSS); // tráo bài lần 1

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
					return check_win([cel1[2], cel2[1], cel3[0], cel4[1], cel5[2]], selectLine);
					break;

				case 5:
					return check_win([cel1[0], cel2[1], cel3[2], cel4[1], cel5[0]], selectLine);
					break;

				case 6:
					return check_win([cel1[1], cel2[0], cel3[0], cel4[0], cel5[1]], selectLine);
					break;

				case 7:
					return check_win([cel1[1], cel2[2], cel3[2], cel4[2], cel5[1]], selectLine);
					break;

				case 8:
					return check_win([cel1[0], cel2[0], cel3[1], cel4[2], cel5[2]], selectLine);
					break;

				case 9:
					return check_win([cel1[2], cel2[2], cel3[1], cel4[0], cel5[0]], selectLine);
					break;

				case 10:
					return check_win([cel1[1], cel2[2], cel3[1], cel4[0], cel5[1]], selectLine);
					break;

				case 11:
					return check_win([cel1[1], cel2[0], cel3[1], cel4[2], cel5[1]], selectLine);
					break;

				case 12:
					return check_win([cel1[0], cel2[1], cel3[1], cel4[1], cel5[0]], selectLine);
					break;

				case 13:
					return check_win([cel1[2], cel2[1], cel3[1], cel4[1], cel5[2]], selectLine);
					break;

				case 14:
					return check_win([cel1[0], cel2[1], cel3[0], cel4[1], cel5[0]], selectLine);
					break;

				case 15:
					return check_win([cel1[2], cel2[1], cel3[2], cel4[1], cel5[2]], selectLine);
					break;

				case 16:
					return check_win([cel1[1], cel2[1], cel3[0], cel4[1], cel5[1]], selectLine);
					break;

				case 17:
					return check_win([cel1[1], cel2[1], cel3[2], cel4[1], cel5[1]], selectLine);
					break;

				case 18:
					return check_win([cel1[0], cel2[0], cel3[2], cel4[0], cel5[0]], selectLine);
					break;

				case 19:
					return check_win([cel1[2], cel2[2], cel3[0], cel4[2], cel5[2]], selectLine);
					break;

				case 20:
					return check_win([cel1[0], cel2[2], cel3[2], cel4[2], cel5[0]], selectLine);
					break;

				case 21:
					return check_win([cel1[2], cel2[0], cel3[0], cel4[0], cel5[2]], selectLine);
					break;

				case 22:
					return check_win([cel1[1], cel2[0], cel3[2], cel4[0], cel5[1]], selectLine);
					break;

				case 23:
					return check_win([cel1[1], cel2[2], cel3[0], cel4[2], cel5[1]], selectLine);
					break;

				case 24:
					return check_win([cel1[0], cel2[2], cel3[0], cel4[2], cel5[0]], selectLine);
					break;

				case 25:
					return check_win([cel1[2], cel2[0], cel3[2], cel4[0], cel5[2]], selectLine);
					break;
			}
		}))
		.then(result => {
			line = null;
			result.forEach(function(line_win) {
				if(!nohu && line_win.win == 10) {
					if (line_win.type === 5) {
						// x8000
						bet_win += bet*8000;
					}else if (line_win.type === 4){
						// x1000
						bet_win += bet*1000;
					}else if (line_win.type === 3){
						// x50
						bet_win += bet*50;
					}else if (line_win.type === 2){
						// x8
						bet_win += bet*8;
					}
				} else if (line_win.win == 9) {
					if (line_win.type === 5) {
						// Nổ Hũ
						let okHu = 0;
						if (!nohu) {
							okHu = Math.floor(dataHu.bet-Math.ceil(dataHu.bet*2/100));
							bet_win += okHu;
							HU.updateOne({game:'long', type:bet, red:true}, {$set:{name:'', bet:dataHu.min}}).exec();
						}else{
							okHu = Math.floor(dataHu.min-Math.ceil(dataHu.min*2/100));
							bet_win += okHu;
						}
						io.sendInHome({pushnohu:{title:'LONG LÂN', name:user.name, bet:okHu}});
						nohu = true;
					}else if (!nohu && line_win.type === 4){
						// x100
						bet_win += bet*100;
					}else if (!nohu && line_win.type === 3){
						// x25
						bet_win += bet*25;
					}else if (!nohu && line_win.type === 2){
						// x4
						bet_win += bet*4;
					}
				}else if(!nohu && line_win.win == 6) {
					if (line_win.type === 5) {
						// x500
						bet_win += bet*500;
					}else if (line_win.type === 4){
						// x75
						bet_win += bet*75;
					}else if (line_win.type === 3){
						// x20
						bet_win += bet*20;
					}
				}else if(!nohu && line_win.win == 5) {
					if (line_win.type === 5) {
						// x375
						bet_win += bet*375;
					}else if (line_win.type === 4){
						// x60
						bet_win += bet*60;
					}else if (line_win.type === 3){
						// x16
						bet_win += bet*16;
					}
				}else if(line_win.win == 4) {
					if (line_win.type === 5) {
						// x275
						bet_win += bet*275;
					}else if (line_win.type === 4){
						// x45
						bet_win += bet*45;
					}else if (line_win.type === 3){
						// x12
						bet_win += bet*12;
					}
				}else if(!nohu && line_win.win == 3) {
					if (line_win.type === 5) {
						// x150
						bet_win += bet*150;
					}else if (line_win.type === 4){
						// x30
						bet_win += bet*30;
					}else if (line_win.type === 3){
						// x10
						bet_win += bet*10;
					}
				}else if(!nohu && line_win.win == 2) {
					if (line_win.type === 5) {
						// x50
						bet_win += bet*50;
					}else if (line_win.type === 4){
						// x25
						bet_win += bet*25;
					}else if (line_win.type === 3){
						// x5
						bet_win += bet*5;
					}
				}else if(!nohu && line_win.win == 1) {
					if (line_win.type === 5) {
						// x25
						bet_win += bet*25;
					}else if (line_win.type === 4){
						// x10
						bet_win += bet*10;
					}else if (line_win.type === 3){
						// x5
						bet_win += bet*5;
					}
				}else if(!nohu && line_win.win == 0) {
					if (line_win.type === 5) {
						// x10
						bet_win += bet*10;
					}else if (line_win.type === 4){
						// x5
						bet_win += bet*5;
					}else if (line_win.type === 3){
						// x2
						bet_win += bet*2;
					}
				}
			});
			if (!nohu && bet_win >= tongCuoc*2.24) {
				io.sendInHome({news:{t:{game:'LONG LÂN', users:user.name, bet:bet_win, status:2}}});
			}
			HU.updateOne({game:'long', type:bet, red:true}, {$inc:{bet:addQuy}}).exec();

			io = null;
			user = null
			bet = null;
			a = null;
			tongCuoc = null;
			addQuy  = null;
			bet_win = null;
			nohu    = null;
			aRwin = null;
			celSS = null;
			cel1 = null;
			cel2 = null;
			cel3 = null;
			cel4 = null;
			cel5 = null;
		});
	});
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
