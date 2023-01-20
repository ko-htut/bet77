
let HU              = require('../../../Models/HU');

let AngryBirds_red  = require('../../../Models/AngryBirds/AngryBirds_red');
let AngryBirds_xu   = require('../../../Models/AngryBirds/AngryBirds_xu');
let AngryBirds_user = require('../../../Models/AngryBirds/AngryBirds_user');

let MegaJP_user     = require('../../../Models/MegaJP/MegaJP_user');
let MegaJP_nhan     = require('../../../Models/MegaJP/MegaJP_nhan');

let UserInfo     = require('../../../Models/UserInfo');
let Helpers      = require('../../../Helpers/Helpers');

function random_cel3(){
	return (Math.random()*6)>>0;
}

function random_cel2(){
	let a = (Math.random()*21)>>0;
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


function random_celR3(){
	let a = random_cel3();
	if (a == 5) {
		// 5
		return 2;
	}else if (a >= 3 && a < 5) {
		// 3 4
		return 1;
	}else{
		// 0 1 2
		return 0;
	}
}

function random_celR(){
	let a = (Math.random()*10)>>0;
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

function check_win(data, line){
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
			return index != 5 ? c+thaythe :c;
		})).then(temp1 => {
			Promise.all(arrT.map(function(c, index){
				if (c === 3 && index !== 0) {
					win_icon = index;
					win_type = 3;
				}
				return void 0;
			})).then(result => {
				aT({line:line, win:win_icon, type:win_type});
			})
		})
	})
	.then(result => {
		return result;
	})
	*/
}

module.exports = function(client, data){
	if (!!data && !!data.cuoc) {
		let bet  = data.cuoc>>0;                   // Mức cược
		let red  = !!data.red;                     // Loại tiền (Red:true, Xu:false)

		if (!(bet == 100 || bet == 1000 || bet == 10000)) {
			client.red({mini:{arb:{status:0}}, notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'THẤT BẠI'}});
		}else{
			UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
				if (!user || (red && user.red < bet) || (!red && user.xu < bet)) {
					client.red({mini:{arb:{status:0, notice:'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}});
				}else{
					let phe = red ? 2 :4;    // Phế
					let addQuy = (bet*0.01)>>0;

					let line_nohu = 0;
					let win_arr   = null;
					let bet_win   = 0;
					let type      = 0;   // Loại được ăn lớn nhất trong phiên

					let config = require('../../../../config/angrybird.json');

					HU.findOne({game:'arb', type:bet, red:red}, 'name bet min toX balans x', function(err, dataHu){
						let uInfo      = {};
						let mini_users = {};
						let huUpdate   = {bet:addQuy, toX:0, balans:0};
						if (red){
							huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     = 0; // Khởi tạo
						}else{
							huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 0; // Khởi tạo
						}

						let nohu     = false;
						let isBigWin = false;
						let quyHu    = dataHu.bet;
						let quyMin   = dataHu.min;

						let toX      = dataHu.toX;
						let balans   = dataHu.balans;

						let celSS = null;
						if (config.chedo == 0 || !red) {
							// khó
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), random_celR(), random_celR(),
								1,             0,             0,
							];
						}else if (config.chedo == 1) {
							// trung bình
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), random_celR(), random_celR(),
								1,             1,              0,
							];
						}else{
							// dễ
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), random_celR(), random_celR(),
								random_celR(), 1,              0,
							];
						}

						celSS = Helpers.shuffle(celSS); // tráo bài lần 1
						celSS = Helpers.shuffle(celSS); // tráo bài lần 2

						let cel1 = [celSS[0], celSS[1], celSS[2]]; // Cột 1
						let cel2 = [celSS[3], celSS[4], celSS[5]]; // Cột 2
						let cel3 = [celSS[6], celSS[7], celSS[8]]; // Cột 3

						// Tạo kết quả 2 Hàng sau
						let celSR = [
							random_celR(),  random_celR(), random_celR3(),
							random_celR3(), 0,             0,
						]; // Super

						celSR = Helpers.shuffle(celSR); // tráo bài lần 1
						celSR = Helpers.shuffle(celSR); // tráo bài lần 2

						let celR1  = [celSR[0], celSR[1], celSR[2]]; // Cột 1
						let celR2  = [celSR[3], celSR[4], celSR[5]]; // Cột 2

						let checkName = (client.profile.name == dataHu.name);

						if (checkName) {
							line_nohu = Math.floor(Math.random()*(27-1+1))+1;

							celR1[1] = 3;
							celR2[1] = 3;
						}

						let heso_T = [1, 3, 5, 10];                  // He so an
						let heso   = 1;
						if (celR1[1] != 0) {
							heso = heso_T[celR1[1]]*heso_T[celR2[1]];
						}

						// kiểm tra kết quả
						Promise.all([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27].map(function(line){
							switch(line){
								case 1:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[0] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[0], cel2[0], cel3[0]], line);
									break;

								case 2:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[0] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[0], cel2[0], cel3[1]], line);
									break;

								case 3:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[0] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[0], cel2[0], cel3[2]], line);
									break;

								case 4:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[1] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[0], cel2[1], cel3[0]], line);
									break;

								case 5:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[1] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[0], cel2[1], cel3[1]], line);
									break;

								case 6:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[1] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[0], cel2[1], cel3[2]], line);
									break;

								case 7:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[2] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[0], cel2[2], cel3[0]], line);
									break;

								case 8:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[2] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[0], cel2[2], cel3[1]], line);
									break;

								case 9:
									if (!!line_nohu && line_nohu == line) {
										cel1[0] = 4;
										cel2[2] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[0], cel2[2], cel3[2]], line);
									break;

								case 10:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[0] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[1], cel2[0], cel3[0]], line);
									break;

								case 11:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[0] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[1], cel2[0], cel3[1]], line);
									break;

								case 12:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[0] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[1], cel2[0], cel3[2]], line);
									break;

								case 13:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[1] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[1], cel2[1], cel3[0]], line);
									break;

								case 14:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[1] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[1], cel2[1], cel3[1]], line);
									break;

								case 15:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[1] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[1], cel2[1], cel3[2]], line);
									break;

								case 16:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[2] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[1], cel2[2], cel3[0]], line);
									break;

								case 17:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[2] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[1], cel2[2], cel3[1]], line);
									break;

								case 18:
									if (!!line_nohu && line_nohu == line) {
										cel1[1] = 4;
										cel2[2] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[1], cel2[2], cel3[2]], line);
									break;

								case 19:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[0] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[2], cel2[0], cel3[0]], line);
									break;

								case 20:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[0] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[2], cel2[0], cel3[1]], line);
									break;

								case 21:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[0] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[2], cel2[0], cel3[2]], line);
									break;

								case 22:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[1] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[2], cel2[1], cel3[0]], line);
									break;

								case 23:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[1] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[2], cel2[1], cel3[1]], line);
									break;

								case 24:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[1] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[2], cel2[1], cel3[2]], line);
									break;

								case 25:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[2] = 4;
										cel3[0] = 4;
									}
									return check_win([cel1[2], cel2[2], cel3[0]], line);
									break;

								case 26:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[2] = 4;
										cel3[1] = 4;
									}
									return check_win([cel1[2], cel2[2], cel3[1]], line);
									break;

								case 27:
									if (!!line_nohu && line_nohu == line) {
										cel1[2] = 4;
										cel2[2] = 4;
										cel3[2] = 4;
									}
									return check_win([cel1[2], cel2[2], cel3[2]], line);
									break;
							}
						}))
						.then(result => {
							result = result.filter(function(line_win){
								if (line_win.type != null) {
									if(line_win.win == 4) {
										// x10
										if (heso == 100) {
											// nổ hũ
											type = 2;

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

											if (!nohu) {
												nohu = true;
												let okHu = (quyHu-Math.ceil(quyHu*phe/100))>>0;
												bet_win += okHu;
												if (red){
													client.redT.sendInHome({pushnohu:{title:'AngryBirds', name:client.profile.name, bet:okHu}});
													huUpdate['hu']   = uInfo['hu']   = mini_users['hu']  += 1; // Cập nhật Số Hũ Red đã Trúng
												}else{
													huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] += 1; // Cập nhật Số Hũ Xu đã Trúng
												}
											}else{
												let okHu = (quyMin-Math.ceil(quyMin*phe/100))>>0;
												bet_win += okHu;
												if (red){
													client.redT.sendInHome({pushnohu:{title:'AngryBirds', name:client.profile.name, bet:okHu}});
													huUpdate['hu']   = uInfo['hu']   = mini_users['hu']   += 1; // Cập nhật Số Hũ Red đã Trúng
												}else{
													huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] += 1; // Cập nhật Số Hũ Xu đã Trúng
												}
											}
											HU.updateOne({game:'arb', type:bet, red:red}, {$set:{name:'', bet:quyMin}}).exec();
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
								return (line_win.type != null);
							});

							bet_win  = nohu ? bet_win :bet_win*heso; // Tổng tiền ăn đc (chưa cắt phế)
							let tien = bet_win-bet;
							if (!nohu && bet_win >= bet*10) {
								isBigWin = true;          // Là thắng lớn
								type = 1;
								if (red) {
									client.redT.sendInHome({news:{t:{game:'AngryBirds', users:client.profile.name, bet:bet_win, status:2}}});
								}
							}

							let thuong     = 0;
							if (red) {
								uInfo['red'] = tien;                                   // Cập nhật Số dư Red trong tài khoản
								huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = bet;            // Cập nhật Số Red đã chơi
								if (tien > 0){
									huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien;        // Cập nhật Số Red đã Thắng
								}
								if (tien < 0){
									huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
								}
								
								AngryBirds_red.create({'name':client.profile.name, 'type':type, 'win':bet_win, 'bet':bet, 'time':new Date()}, function (err, small) {
									if (err){
										client.red({mini:{arb:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									}else{
										client.red({mini:{arb:{status:1, cel:[cel1, cel2, cel3], celR:[celR1, celR2], line_win:result, nohu:nohu, isBigWin:isBigWin, win:bet_win}}, user:{red:user.red-bet}});
									}
								});

								MegaJP_user.findOne({uid:client.UID}, {}, function(err, updateMega){
									if (!!updateMega) {
										if (tien > 0){
											updateMega['win'+bet] += tien;
										}
										if (tien < 0){
											updateMega['lost'+bet] += tien*-1;
										}

										let MWin    = updateMega['win'+bet];
										let MLost   = updateMega['lost'+bet];
										let MUpdate = updateMega['last'+bet];
										let RedHuong = MLost-MWin-MUpdate;
										if (bet !== 10000) {
											if (RedHuong > bet*4000) {
												updateMega[bet] += 1;
												updateMega['last'+bet] += RedHuong;
												MegaJP_nhan.create({'uid':client.UID, 'room':bet, 'to':100, 'sl':1, 'status':true, 'time':new Date()});
											}
										}else{
											if (RedHuong > bet*1000) {
												updateMega[bet] += 1;
												updateMega['last'+bet] += RedHuong;
												MegaJP_nhan.create({'uid':client.UID, 'room':bet, 'to':100, 'sl':1, 'status':true, 'time':new Date()});
											}
										}
										updateMega.save();
									}
								});
							}else{
								thuong = (bet_win*0.039589)>>0;
								uInfo['xu'] = tien;                               // Cập nhật Số dư XU trong tài khoản
								huUpdate['xuPlay'] = uInfo['xuPlay'] = mini_users['betXu'] = bet;     // Cập nhật Số XU đã chơi
								if (thuong > 0){
									uInfo['red'] = uInfo['thuong'] = mini_users['thuong'] = thuong;  // Cập nhật Số dư Red trong tài khoản // Cập nhật Số Red được thưởng do chơi XU
								}
								if (tien > 0){
									huUpdate['xuWin'] = uInfo['xuWin'] = mini_users['winXu'] = tien;         // Cập nhật Số Red đã Thắng
								}
								if (tien < 0){
									huUpdate['xuLost'] = uInfo['xuLost'] = mini_users['lostXu'] = tien*(-1); // Cập nhật Số Red đã Thua
								}

								AngryBirds_xu.create({'name':client.profile.name, 'type':type, 'win':bet_win, 'bet':bet, 'time':new Date()}, function (err, small) {
									if (err){
										client.red({mini:{arb:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									}else{
										client.red({mini:{arb:{status:1, cel:[cel1, cel2, cel3], celR:[celR1, celR2], line_win:result, nohu:nohu, isBigWin:isBigWin, win:bet_win, thuong:thuong}}, user:{xu:user.xu-bet}});
									}
								});
							}
							HU.updateOne({game:'arb', type:bet, red:red}, {$inc:huUpdate}).exec();
							UserInfo.updateOne({id:client.UID}, {$inc:uInfo}).exec();
							AngryBirds_user.updateOne({'uid':client.UID}, {$set:{time:new Date()}, $inc:mini_users}).exec();
						})
					})
				}
			});
		}
	}
};
