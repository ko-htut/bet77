
let HU      = require('../../Models/HU');
let Helpers = require('../../Helpers/Helpers');

let random_cel2 = function(){
	let a = Math.floor(Math.random()*21);
	if (a == 20) {
		// 20
		return 5;
	}else if (a >= 18 && a < 20) {
		// 18 19
		return 4;
	}else if (a >= 15 && a < 18) {
		// 15 16 17
		return 3;
	}else if (a >= 11 && a < 15) {
		// 11 12 13 14
		return 2;
	}else if (a >= 6 && a < 11) {
		// 6 7 8 9 10
		return 1;
	}else{
		// 0 1 2 3 4 5
		return 0;
	}
}

let random_celR = function(){
	let a = Math.floor(Math.random()*10);
	if (a == 9) {
		// 9
		return 3;
	}else if (a >= 7 && a < 9) {
		// 7 8
		return 2;
	}else if (a >= 4 && a < 7) {
		// 4 5 6
		return 1;
	}else{
		// 0 1 2 3
		return 0;
	}
}

let check_win = function(data, line){
	let win_icon = 0;
	let win_type = null;
	let thaythe  = 0;  // Thay Thế (WinD)
	let arrT     = []; // Mảng lọc các bộ

	for (let i = 0; i < 3; i++) {
		let dataT = data[i];
		if (dataT == 5) {
			++thaythe;
		}
		if (void 0 === arrT[dataT]) {
			arrT[dataT] = 1;
		}else{
			arrT[dataT] += 1;
		}
	}

	arrT.forEach(function(c, index) {
		if (index != 5 && index != 4) {
			arrT[index] += thaythe;
		}
	});

	arrT.forEach(function(c, index) {
		if (c === 3 && index !== 0) {
			win_icon = index;
			win_type = 3;
		}
	});

	return {line:line, win:win_icon, type:win_type};


	/**
	return new Promise((aT, bT) => {
		Promise.all(arrT.map(function(c, index){
			if (index != 5 && index != 4) {
				arrT[index] += thaythe;
			}
			return index != 5 ? c+thaythe : c;
		})).then(temp1 => {
			Promise.all(arrT.map(function(c, index){
				if (c === 3 && index !== 0) {
					win_icon = index;
					win_type = 3;
				}
				return void 0;
			})).then(result => {
				result = null;
				aT({line:line, win:win_icon, type:win_type});
			})
		})
	})
	.then(result => {
		data = null;
		line = null;
		win_icon = null;
		win_type = null;
		thaythe  = null;
		arrT     = null;
		return result;
	})
	*/
}

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

	let addQuy  = Math.floor(bet*0.01);
	let bet_win = 0;

	HU.findOne({game:'arb', type:bet, red:true}, 'name bet min toX balans x', function(err, dataHu){
		let huUpdate = {bet:addQuy, toX:0, balans:0};

		let nohu     = false;
		let quyMin   = dataHu.min;

		let toX      = dataHu.toX;
		let balans   = dataHu.balans;

		let aRwin = Math.floor(Math.random()*50);

		let celSS = [];
		let celSR = [];

		if (aRwin == 49) {
			// no hu
			celSS = [
				random_cel2(), random_cel2(), random_cel2(),
				4,             4,             4,
				random_cel2(), 0,             0,
			];

			// Tạo kết quả 2 Hàng sau
			celSR = [
				random_celR(), random_celR(), 3,
				0,             0,             0,
			];
		}else{
			// kho
			celSS = [
				random_cel2(), random_cel2(), 0,
				3, 2, 1,
				0,             0,             0,
			];

			// Tạo kết quả 2 Hàng sau
			celSR = [
				random_celR(), random_celR(), 0,
				0,             0,             0,
			];
		}

		celSS = Helpers.shuffle(celSS); // tráo bài lần 1

		let cel1 = [celSS[0], celSS[1], celSS[2]]; // Cột 1
		let cel2 = [celSS[3], celSS[4], celSS[5]]; // Cột 2
		let cel3 = [celSS[6], celSS[7], celSS[8]]; // Cột 3

		celSR = Helpers.shuffle(celSR); // tráo bài lần 1

		let celR1  = [celSR[0], celSR[1], celSR[2]]; // Cột 1
		let celR2  = [celSR[3], celSR[4], celSR[5]]; // Cột 2

		let heso_T = [1, 3, 5, 10];                  // He so an
		let heso   = 1;
		if (celR1[1] != 0) {
			heso = heso_T[celR1[1]]*heso_T[celR2[1]];
		}

		// kiểm tra kết quả
		let arrline = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
		Promise.all(arrline.map(function(line){
			switch(line){
				case 1:
					return check_win([cel1[0], cel2[0], cel3[0]], line);
					break;

				case 2:
					return check_win([cel1[0], cel2[0], cel3[1]], line);
					break;

				case 3:
					return check_win([cel1[0], cel2[0], cel3[2]], line);
					break;

				case 4:
					return check_win([cel1[0], cel2[1], cel3[0]], line);
					break;

				case 5:
					return check_win([cel1[0], cel2[1], cel3[1]], line);
					break;

				case 6:
					return check_win([cel1[0], cel2[1], cel3[2]], line);
					break;

				case 7:
					return check_win([cel1[0], cel2[2], cel3[0]], line);
					break;

				case 8:
					return check_win([cel1[0], cel2[2], cel3[1]], line);
					break;

				case 9:
					return check_win([cel1[0], cel2[2], cel3[2]], line);
					break;

				case 10:
					return check_win([cel1[1], cel2[0], cel3[0]], line);
					break;

				case 11:
					return check_win([cel1[1], cel2[0], cel3[1]], line);
					break;

				case 12:
					return check_win([cel1[1], cel2[0], cel3[2]], line);
					break;

				case 13:
					return check_win([cel1[1], cel2[1], cel3[0]], line);
					break;

				case 14:
					return check_win([cel1[1], cel2[1], cel3[1]], line);
					break;

				case 15:
					return check_win([cel1[1], cel2[1], cel3[2]], line);
					break;

				case 16:
					return check_win([cel1[1], cel2[2], cel3[0]], line);
					break;

				case 17:
					return check_win([cel1[1], cel2[2], cel3[1]], line);
					break;

				case 18:
					return check_win([cel1[1], cel2[2], cel3[2]], line);
					break;

				case 19:
					return check_win([cel1[2], cel2[0], cel3[0]], line);
					break;

				case 20:
					return check_win([cel1[2], cel2[0], cel3[1]], line);
					break;

				case 21:
					return check_win([cel1[2], cel2[0], cel3[2]], line);
					break;

				case 22:
					return check_win([cel1[2], cel2[1], cel3[0]], line);
					break;

				case 23:
					return check_win([cel1[2], cel2[1], cel3[1]], line);
					break;

				case 24:
					return check_win([cel1[2], cel2[1], cel3[2]], line);
					break;

				case 25:
					return check_win([cel1[2], cel2[2], cel3[0]], line);
					break;

				case 26:
					return check_win([cel1[2], cel2[2], cel3[1]], line);
					break;

				case 27:
					return check_win([cel1[2], cel2[2], cel3[2]], line);
					break;
			}
		}))
		.then(result => {
			arrline = null;
			result.forEach(function(line_win) {
				if (line_win.type != null) {
					if(line_win.win == 4) {
						// x10
						if (heso == 100) {
							// nổ hũ
							if (toX > 0) {
								toX -= 1;
								huUpdate.toX -= 1;
							}else if (balans > 0) {
								balans -= 1;
								huUpdate.balans -= 1;
							}
							if (toX < 1 && balans > 0) {
								quyMin = dataHu.min*dataHu.x;
							}
							let okHu = 0;
							if (!nohu) {
								nohu = true;
								okHu = Math.floor(dataHu.bet-Math.ceil(dataHu.bet*2/100));
								bet_win += okHu;
							}else{
								okHu = Math.floor(quyMin-Math.ceil(quyMin*2/100));
								bet_win += okHu;
							}
							io.sendInHome({pushnohu:{title:'AngryBirds', name:user.name, bet:okHu}});
							HU.updateOne({game:'arb', type:bet, red:true}, {$set:{name:'', bet:quyMin}}).exec();
						}else{
							bet_win += bet*10;
						}
					}else if(!nohu && line_win.win == 3) {
						// x1.1
						bet_win += bet*1.1;
					}else if(!nohu && line_win.win == 2) {
						// x0.3
						bet_win += bet*0.3;
					}else if(!nohu && line_win.win == 1) {
						// x0.1
						bet_win += bet*0.1;
					}
				}
			});
			bet_win  = nohu ? bet_win : bet_win*heso; // Tổng tiền ăn đc (chưa cắt phế)
			if (!nohu && bet_win >= bet*10) {
				io.sendInHome({news:{t:{game:'AngryBirds', users:user.name, bet:bet_win, status:2}}});
			}
			HU.updateOne({game:'arb', type:bet, red:true}, {$inc:huUpdate}).exec();
			io   = null;
			user = null;
			bet = null;
			a = null;
			addQuy   = null;
			bet_win  = null;
			huUpdate = null;
			nohu     = null;
			quyMin   = null;
			toX      = null;
			balans   = null;
			aRwin = null;
			celSS = null;
			celSR = null;
			cel1 = null;
			cel2 = null;
			cel3 = null;
			celR1  = null;
			celR2  = null;
			heso_T = null;
			heso   = null;
		})
	})
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
