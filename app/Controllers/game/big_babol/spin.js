
let HU             = require('../../../Models/HU');

let BigBabol_red   = require('../../../Models/BigBabol/BigBabol_red');
let BigBabol_xu    = require('../../../Models/BigBabol/BigBabol_xu');
let BigBabol_users = require('../../../Models/BigBabol/BigBabol_users');

let MegaJP_user    = require('../../../Models/MegaJP/MegaJP_user');
let MegaJP_nhan    = require('../../../Models/MegaJP/MegaJP_nhan');

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

function random_cel1(){
	let a = (Math.random()*15)>>0;
	if (a == 14) {
		// 14
		return 4;
	}else if (a >= 12 && a < 14) {
		// 12 13
		return 3;
	}else if (a >= 9 && a < 12) {
		// 9 10 11
		return 2;
	}else if (a >= 5 && a < 9) {
		// 5 6 7 8
		return 1;
	}else{
		// 0 1 2 3 4
		return 0;
	}
}

function check_win(data, line){
	let win_icon = 0;
	let heso     = 0;
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
		if (index != 5) {
			arrT[index] += thaythe;
		}
	});

	arrT.forEach(function(c, index) {
		if (c === 3) {
			win_icon = index;
			win_type = 3;
		}
		if (c === 2 && (index == 0 || index == 1)) {
			win_icon = index;
			win_type = 2;
			if (index == 0) {
				heso += 0.4;
			}else{
				heso += 0.8;
			}
		}
	});

	data = null;
	thaythe = null;
	arrT    = null;

	return {line:line, win:win_icon, type:win_type, heso:heso};
}

module.exports = function(client, data){
	if (!!data && !!data.cuoc && Array.isArray(data.line)) {
		let bet  = data.cuoc>>0;                   // Mức cược
		let red  = !!data.red;                     // Loại tiền (Red:true, Xu:false)
		let line = Array.from(new Set(data.line)); // Dòng cược // fix trùng lặp
		if (!(bet == 100 || bet == 1000 || bet == 10000) || line.length < 1) {
			client.red({mini:{big_babol:{status:0}}, notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'THẤT BẠI'}});
		}else{
			let cuoc = bet*line.length;  // Tiền cược
			UserInfo.findOne({id:client.UID}, red ? 'red name':'xu name', function(err, user){
				if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
					client.red({mini:{big_babol:{status:0, notice:'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}});
				}else{
					let config = require('../../../../config/bigbabol.json');
					let phe = red ? 2 :4;    // Phế
					let addQuy = (cuoc*0.005)>>0;

					let line_nohu = 0;
					let win_arr   = null;
					let bet_win   = 0;
					let type      = 0;   // Loại được ăn lớn nhất trong phiên
					// tạo kết quả
					HU.findOne({game:'bigbabol', type:bet, red:red}, 'name bet min toX balans x', function(err, dataHu){
						let uInfo      = {};
						let mini_users = {};
						let huUpdate   = {bet:addQuy, toX:0, balans:0};
						if (red){
							huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     = 0; // Khởi tạo
						}else{
							huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 0; // Khởi tạo
						}

						let celSS = null;
						if (config.chedo == 0 || !red) {
							// khó
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								3,             1,             2,
								1,             0,             0,
							];
						}else if (config.chedo == 1) {
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), 2,             1,
								1,             0,             0,
							];
						}else{
							// dễ
							celSS = [
								random_cel2(), random_cel2(), random_cel2(),
								random_cel2(), random_cel1(), 1,
								1,             0,             0,
							];
						}

						celSS = Helpers.shuffle(celSS); // tráo bài lần 1
						celSS = Helpers.shuffle(celSS); // tráo bài lần 2

						let cel1 = [celSS[0], celSS[1], celSS[2]]; // Cột 1
						let cel2 = [celSS[3], celSS[4], celSS[5]]; // Cột 2
						let cel3 = [celSS[6], celSS[7], celSS[8]]; // Cột 3

						let nohu      = false;
						let isBigWin  = false;
						let quyHu     = dataHu.bet;
						let quyMin    = dataHu.min;

						let toX      = dataHu.toX;
						let balans   = dataHu.balans;

						let checkName = (client.profile.name == dataHu.name);

						if (checkName) {
							line_nohu = ((Math.random()*line.length)>>0);
							line_nohu = line[line_nohu];
						}
						// kiểm tra kết quả
						Promise.all(line.map(function(selectLine){
							switch(selectLine){
								case 1:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[0]], selectLine);
									break;

								case 2:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[1]], selectLine);
									break;

								case 3:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[2]], selectLine);
									break;

								case 4:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[0]], selectLine);
									break;

								case 5:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[0] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[0], cel3[2]], selectLine);
									break;

								case 6:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[0]], selectLine);
									break;

								case 7:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[2]], selectLine);
									break;

								case 8:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[0]], selectLine);
									break;

								case 9:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[1]], selectLine);
									break;

								case 10:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[1]], selectLine);
									break;

								case 11:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[2]], selectLine);
									break;

								case 12:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[0] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[0], cel3[1]], selectLine);
									break;

								case 13:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[2]], selectLine);
									break;

								case 14:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[1] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[1], cel2[1], cel3[0]], selectLine);
									break;

								case 15:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[2], cel2[2], cel3[1]], selectLine);
									break;

								case 16:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[0] = 5;
										cel3[0] = 5;
									}
									return check_win([cel1[1], cel2[0], cel3[0]], selectLine);
									break;

								case 17:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[2] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[2], cel2[1], cel3[1]], selectLine);
									break;

								case 18:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[1] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[1], cel3[1]], selectLine);
									break;

								case 19:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[1] = 5;
										cel2[2] = 5;
										cel3[2] = 5;
									}
									return check_win([cel1[1], cel2[2], cel3[2]], selectLine);
									break;

								case 20:
									if (!!line_nohu && line_nohu == selectLine) {
										cel1[0] = 5;
										cel2[2] = 5;
										cel3[1] = 5;
									}
									return check_win([cel1[0], cel2[2], cel3[1]], selectLine);
									break;
							}
						}))
						.then(result => {
							result = result.filter(function(line_win){
								if (line_win.type != null) {
									if(line_win.win == 5) {
										// Nổ hũ
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
											var okHu = (quyHu-Math.ceil(quyHu*phe/100))>>0;
											bet_win += okHu;
											red && client.redT.sendInHome({pushnohu:{title:'BigBabol', name:client.profile.name, bet:okHu}});
										}else{
											var okHu = (quyMin-Math.ceil(quyMin*phe/100))>>0;
											bet_win += okHu;
											red && client.redT.sendInHome({pushnohu:{title:'BigBabol', name:client.profile.name, bet:okHu}});
										}
										HU.updateOne({game:'bigbabol', type:bet, red:red}, {$set:{name:'', bet:quyMin}}).exec();

										if (red){
											huUpdate['hu'] = uInfo['hu'] = mini_users['hu']     += 1;
										}else{
											huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] += 1;
										}
										nohu = true;
										type = 2;
									}else if(!nohu && line_win.win == 4) {
										// x80
										bet_win += bet*80;
									}else if(!nohu && line_win.win == 3) {
										// x40
										bet_win += bet*40;
									}else if(!nohu && line_win.win == 2) {
										// x20
										bet_win += bet*20;
									}else if(!nohu && line_win.win == 1 && line_win.type == 3) {
										// x8
										bet_win += bet*8;
									}else if(!nohu && line_win.win == 1 && line_win.type == 2) {
										//	x0.8
										bet_win += (bet*line_win.heso)>>0;
									}else if(!nohu && line_win.win == 0 && line_win.type == 3) {
										// x4
										bet_win += bet*4;
									}else if(!nohu && line_win.win == 0 && line_win.type == 2) {
										// x0.4
										bet_win += (bet*line_win.heso)>>0;
									}
								}
								return (line_win.type != null);
							});

							let tien = bet_win-cuoc;
							if (!nohu && bet_win >= cuoc*2.24) {
								isBigWin = true;
								type = 1;
								if (red) {
									client.redT.sendInHome({news:{t:{game:'BigBabol', users:client.profile.name, bet:bet_win, status:2}}});
								}
							}

							let thuong     = 0;
							if (red) {
								uInfo['red'] = tien;                                                 // Cập nhật Số dư Red trong tài khoản
								huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = cuoc;   // Cập nhật Số Red đã chơi
								if (tien > 0){
									huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien; // Cập nhật Số Red đã Thắng
								}
								if (tien < 0){
									huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
								}
								BigBabol_red.create({'name':client.profile.name, 'type':type, 'win':bet_win, 'bet':bet, 'kq':result.length, 'line':line.length, 'time':new Date()}, function (err, small) {
									if (err){
										client.red({mini:{big_babol:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									}else{
										client.red({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win:result, nohu:nohu, isBigWin:isBigWin, win:bet_win, phien:small.id}}, user:{red:user.red-cuoc}});
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
												MegaJP_nhan.create({'uid':client.UID, 'room':bet, 'to':101, 'sl':1, 'status':true, 'time':new Date()});
											}
										}else{
											if (RedHuong > bet*1000) {
												updateMega[bet] += 1;
												updateMega['last'+bet] += RedHuong;
												MegaJP_nhan.create({'uid':client.UID, 'room':bet, 'to':101, 'sl':1, 'status':true, 'time':new Date()});
											}
										}
										updateMega.save();
									}
								});
							}else{
								thuong = (bet_win*0.039589)>>0;
								uInfo['xu'] = tien;                                                 // Cập nhật Số dư XU trong tài khoản
								huUpdate['xuPlay'] = uInfo['xuPlay'] = mini_users['betXu'] = cuoc;  // Cập nhật Số XU đã chơi
								if (thuong > 0){
									uInfo['red'] = uInfo['thuong'] = mini_users['thuong'] = thuong; // Cập nhật Số dư Red trong tài khoản // Cập nhật Số Red được thưởng do chơi XU
								}
								if (tien > 0){
									huUpdate['xuWin'] = uInfo['xuWin'] = mini_users['winXu'] = tien;         // Cập nhật Số Red đã Thắng
								}
								if (tien < 0){
									huUpdate['xuLost'] = uInfo['xuLost'] = mini_users['lostXu'] = tien*(-1); // Cập nhật Số Red đã Thua
								}
								BigBabol_xu.create({'name':client.profile.name, 'type':type, 'win':bet_win, 'bet':bet, 'kq':result.length, 'line':line.length, 'time':new Date()}, function (err, small) {
									if (err){
										client.red({mini:{big_babol:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
									}else{
										client.red({mini:{big_babol:{status:1, cel:[cel1, cel2, cel3], line_win:result, nohu:nohu, isBigWin:isBigWin, win:bet_win, phien:small.id, thuong:thuong}}, user:{xu:user.xu-cuoc}});
									}
								});
							}
							HU.updateOne({game:'bigbabol', type:bet, red:red}, {$inc:huUpdate}).exec();
							UserInfo.updateOne({id:client.UID}, {$inc:uInfo}).exec();
							BigBabol_users.updateOne({'uid':client.UID}, {$set:{time:new Date()}, $inc:mini_users}).exec();
						});
					});
				}
			});
		}
	}
};
