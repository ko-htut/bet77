
let HU             = require('../../Models/HU');
let miniPokerUsers = require('../../Models/miniPoker/miniPoker_users');

let miniPokerRed = require('../../Models/miniPoker/miniPokerRed');
let miniPokerXu  = require('../../Models/miniPoker/miniPokerXu');

let MegaJP_user  = require('../../Models/MegaJP/MegaJP_user');
let MegaJP_nhan  = require('../../Models/MegaJP/MegaJP_nhan');

let UserInfo  = require('../../Models/UserInfo');
let Helpers   = require('../../Helpers/Helpers');
let base_card = require('../../../data/card');

function spin(client, data){
	if (!!data && !!data.cuoc) {
		let bet = data.cuoc>>0; // Mức cược
		let red = !!data.red; // Loại tiền (Red:true, Xu:false)
		if (!(bet == 100 || bet == 1000 || bet == 10000)) {
			client.red({mini:{poker:{status:0}}, notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'MINI POKER'}});
		}else{
			UserInfo.findOne({id:client.UID}, 'red xu name', function(err, user){
				if (!user || (red && user.red < bet) || (!red && user.xu < bet)) {
					client.red({mini:{poker:{status:0, notice:'Bạn không đủ ' + (red ? 'RED':'XU') + ' để quay.!!'}}});
				}else{
					let phe     = red ? 2 :4;    // Phế
					let addQuy  = (bet*0.01)>>0;
					let an      = 0;
					let code    = 0;
					let text    = '';
					let thuong  = 0;
					let card    = [...base_card.card];

					// tráo bài
					card = Helpers.shuffle(card); // tráo bài lần 1
					card = Helpers.shuffle(card); // tráo bài lần 2
					card = Helpers.shuffle(card); // tráo bài lần 3

					//var ketqua  = [];            // bốc nhẫu nhiên
					let ketqua      = card.slice(0, 5); // bốc 5 thẻ đầu tiên

					let ketqua_temp = [...ketqua]; // copy kết quả để sử lý, (tránh sắp sếp, mất tính ngẫu nhiên)

					let arrT   = [];           // Mảng chứa các bộ (Đôi, Ba, Bốn) trong bài
					for (let i = 0; i < 5; i++) {
						let dataT = ketqua[i];
						if (void 0 === arrT[dataT.card]) {
							arrT[dataT.card] = 1;
						}else{
							arrT[dataT.card] += 1;
						}
						dataT = null;
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
					let dongChat = ketqua_temp.filter(type_card => type_card.type == type); // Kiểm tra đồng chất
					dongChat     = dongChat.length == 5 ? true :false;  // Dây là đồng chất

					let AK    = ketqua_temp.sort(function(a, b){return a.card - b.card}); // sắp sếp từ A đến K (A23...JQK)
					let isDay = false; // là 1 dây
					if (bo3 == false && bo2 == 0 && tuQuy == null) {
						if (AK[4].card - AK[0].card === 4 && AK[0].card !== 0) {
							isDay = true;
						}else if (AK[4].card - AK[1].card === 3 && AK[0].card === 0 && AK[4].card === 12) {
							isDay = true;
						}
					}

					HU.findOne({game:'minipoker', type:bet, red:red}, 'name bet min toX balans x', function(err, dataHu){
						let uInfo      = {};
						let mini_users = {};
						let huUpdate   = {bet:addQuy, toX:0, balans:0};

						let quyHu     = dataHu.bet;
						let quyMin    = dataHu.min;

						let toX       = dataHu.toX;
						let balans    = dataHu.balans;

						let checkName = (client.profile.name == dataHu.name);

						if (checkName || (dongChat && isDay && AK[4].card > 9)) {
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
							HU.updateOne({game:'minipoker', type:bet, red:red}, {$set:{name:'', bet:quyMin}}).exec();
							if (checkName){
								// đặt kết quả thành nổ hũ nếu người chơi được xác định thủ công
								let randomType = (Math.random()*4)>>0;           // Ngẫu nhiên chất bài
								let randomMin  = ((Math.random()*(9-6+1))+6)>>0; // Ngẫu nhiên dây bài bắt đầu từ (7 - 10)
								card = base_card.card.filter(function(cardT){
									if (randomMin == 9 && cardT.card == 0 && cardT.type == randomType) {
										return true;
									}else if (cardT.card >= randomMin && cardT.card < randomMin+5 && cardT.type == randomType) {
										return true;
									}
									return false;
								})
								ketqua = Helpers.shuffle(card); // tráo bài
								randomType = null;
								randomMin = null;
							}

							an   = (quyHu-Math.ceil(quyHu*phe/100))>>0;

							if (red){
								client.redT.sendInHome({pushnohu:{title:'MINI POKER', name:client.profile.name, bet:an}});
								huUpdate['hu']   = uInfo['hu']   = mini_users['hu']   = 1; // Cập nhật Số Hũ Red đã Trúng
							}else{
								huUpdate['huXu'] = uInfo['huXu'] = mini_users['huXu'] = 1; // Cập nhật Số Hũ Xu đã Trúng
							}

							text = 'Nổ Hũ';
							code = 9;
						}else if (isDay && dongChat) {
							// x1000    THÙNG PHÁ SẢNH (DÂY ĐỒNG CHẤT)
							an   = (bet*1000);
							text = 'Thắng Lớn';
							code = 8;
							if (red) {
								client.redT.sendInHome({news:{t:{game:'MINI POKER', users:client.profile.name, bet:an, status:2}}});
							}
						}else if (tuQuy != null) {
							// x150     TỨ QUÝ (TỨ QUÝ)
							an   = (bet*150);
							text = 'Tứ Quý';
							code = 7;
							if (red) {
								client.redT.sendInHome({news:{t:{game:'MINI POKER', users:client.profile.name, bet:an, status:2}}});
							}
						}else if (bo3 && bo2 > 0) {
							// x50      CÙ LŨ (1 BỘ 3 VÀ 1 BỘ 2)
							an   = (bet*50);
							text = 'Cù Lũ';
							code = 6;
						}else if (dongChat) {
							// x20		THÙNG (ĐỒNG CHẤT)
							an   = (bet*20);
							text = 'Thùng';
							code = 5;
						}else if (isDay && !dongChat) {
							// x13		SẢNH (DÂY)
							an   = (bet*13);
							text = 'Sảnh';
							code = 4;
						}else if (bo3 && bo2 == 0) {
							// x8 		SÁM CÔ (1 BỘ 3)
							an   = (bet*8);
							text = 'Sám Cô';
							code = 3;
						}else if (bo2 > 1) {
							// x5	 	THÚ (2 ĐÔI)
							an   = (bet*5);
							text = 'Thú';
							code = 2;
						}else if (bo2 == 1 && (bo2_a[0] > 9 || bo2_a[0] == 0)) {
							// x2.5	 	1 ĐÔI > J
							an   = (bet*2.5);
							text = 'Đôi ' + base_card.name[bo2_a[0]];
							code = 1;
						}

						let tien = an-bet;
						if (red) {
							uInfo['red'] = tien;         // Cập nhật Số dư Red trong tài khoản
							huUpdate['redPlay'] = uInfo['redPlay'] = mini_users['bet'] = bet;       // Cập nhật Số Red đã chơi
							if (tien > 0){
								huUpdate['redWin'] = uInfo['redWin'] = mini_users['win'] = tien;    // Cập nhật Số Red đã Thắng
							}
							if (tien < 0){
								huUpdate['redLost'] = uInfo['redLost'] = mini_users['lost'] = tien*(-1); // Cập nhật Số Red đã Thua
							}
							if (code == 9){
								uInfo['hu'] = mini_users['hu'] = 1;         // Cập nhật Số Hũ Red đã Trúng
							}
							miniPokerRed.create({'name':client.profile.name, 'win':an, 'bet':bet, 'type':code, 'kq':ketqua, 'time':new Date()}, function (err, small) {
								if (err){
									client.red({mini:{poker:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
								}else{
									client.red({mini:{poker:{status:1, card:ketqua, phien:small.id, win:an, text:text, code:code}}, user:{red:user.red-bet, xu:user.xu}});
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
											MegaJP_nhan.create({'uid':client.UID, 'room':bet, 'to':106, 'sl':1, 'status':true, 'time':new Date()});
										}
									}else{
										if (RedHuong > bet*1000) {
											updateMega[bet] += 1;
											updateMega['last'+bet] += RedHuong;
											MegaJP_nhan.create({'uid':client.UID, 'room':bet, 'to':106, 'sl':1, 'status':true, 'time':new Date()});
										}
									}
									updateMega.save();
								}
							});
						}else{
							thuong = (an*0.039589)>>0;
							uInfo['xu'] = tien;         // Cập nhật Số dư XU trong tài khoản
							huUpdate['xuPlay'] = uInfo['xuPlay'] = mini_users['betXu'] = bet;    // Cập nhật Số XU đã chơi
							if (thuong > 0){
								uInfo['red'] = uInfo['thuong'] = mini_users['thuong'] = thuong;  // Cập nhật Số dư xu trong tài khoản // Cập nhật Số Red được thưởng do chơi XU
							}
							if (tien > 0){
								huUpdate['xuWin'] = uInfo['xuWin'] = mini_users['winXu'] = tien; // Cập nhật Số xu đã Thắng
							}
							if (tien < 0){
								huUpdate['xuLost'] = uInfo['xuLost'] = mini_users['lostXu'] = tien*(-1); // Cập nhật Số xu đã Thua
							}
							if (code == 9){
								uInfo['huXu'] = mini_users['huXu'] = 1;      // Cập nhật Số Hũ Xu đã Trúng
							}

							miniPokerXu.create({'name':client.profile.name, 'win':an, 'bet':bet, 'type':code, 'kq':ketqua, 'time':new Date()}, function (err, small) {
								if (err){
									client.red({mini:{poker:{status:0, notice:'Có lỗi sảy ra, vui lòng thử lại.!!'}}});
								}else{
									client.red({mini:{poker:{status:1, card:ketqua, phien:small.id, win:an, thuong:thuong, text:text, code:code}}, user:{red:user.red, xu:user.xu-bet}});
								}
							});
						}
						HU.updateOne({game:'minipoker', type:bet, red:red}, {$inc:huUpdate}).exec();
						UserInfo.updateOne({id:client.UID}, {$inc:uInfo}).exec();
						miniPokerUsers.updateOne({'uid':client.UID}, {$set:{time:new Date()}, $inc:mini_users}).exec();
					});
				}
			});
		}
	}
}

function log(client, data){
	if (!!data && !!data.page) {
		let page = data.page>>0; // trang
		let red  = !!data.red;   // Loại tiền (Red:true, Xu:false)
		if (page < 1) {
			client.red({notice:{text:'DỮ LIỆU KHÔNG ĐÚNG...', title:'MINI POKER'}});
		}else{
			let kmess = 8;
			if (red) {
				miniPokerRed.countDocuments({name:client.profile.name}).exec(function(err, total){
					miniPokerRed.find({name:client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({mini:{poker:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}else{
				miniPokerXu.countDocuments({name:client.profile.name}).exec(function(err, total){
					miniPokerXu.find({name:client.profile.name}, 'id win bet kq time', {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(err, result) {
						Promise.all(result.map(function(obj){
							obj = obj._doc;
							delete obj._id;
							return obj;
						}))
						.then(resultArr => {
							client.red({mini:{poker:{log:{data:resultArr, page:page, kmess:kmess, total:total}}}});
						})
					});
				})
			}
		}
	}
}

function top(client, data){
	let red = !!data; // Loại tiền (Red:true, Xu:false)
	if (red) {
		miniPokerRed.find({type:{$gte:7}}, 'name win bet time type', {sort:{'_id':-1}, limit:50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{poker:{top:arrayOfResults}}});
			})
		});
	}else{
		miniPokerXu.find({type:{$gte:7}}, 'name win bet time type', {sort:{'_id':-1}, limit:50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{poker:{top:arrayOfResults}}});
			})
		});
	}
}

module.exports = function(client, data){
	if (!!data) {
		if (!!data.spin) {
			spin(client, data.spin)
		}
		if (!!data.log) {
			log(client, data.log)
		}
		if (void 0 !== data.top) {
			top(client, data.top)
		}
	};
}
