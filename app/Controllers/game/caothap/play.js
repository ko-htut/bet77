

var CaoThap_red  = require('../../../Models/CaoThap/CaoThap_red');
var CaoThap_xu   = require('../../../Models/CaoThap/CaoThap_xu');

var CaoThap_user    = require('../../../Models/CaoThap/CaoThap_user');
var CaoThap_redbuoc = require('../../../Models/CaoThap/CaoThap_redbuoc');
var CaoThap_xubuoc  = require('../../../Models/CaoThap/CaoThap_xubuoc');

var HU           = require('../../../Models/HU');

var UserInfo     = require('../../../Models/UserInfo');

var Helpers      = require('../../../Helpers/Helpers');
var base_card    = require('../../../../data/card');

var HeSo         = require('./heso');

function newGame(client, data) {
	if (!!data && !!data.cuoc) {
		var cuoc = data.cuoc>>0;  // Tiền cược
		var red  = !!data.red;	  // Loại tiền đang chơi
		if (!(cuoc == 1000 || cuoc == 10000 || cuoc == 50000 || cuoc == 100000 || cuoc == 500000)) {
			// Error
			client.red({mini:{caothap:{status:0,notice: 'Dữ liệu trò chơi không đúng...'}}});
		}else{
			UserInfo.findOne({id:client.UID}, 'red redPlay xu xuPlay', function(err, user){
				if (!user || (red && user.red < cuoc) || (!red && user.xu < cuoc)) {
					client.red({mini:{caothap:{status:0, notice: 'Bạn không đủ ' + (red ? 'RED':'XU') + ' để chơi.!!'}}});
				}else{
					client.caothap = client.caothap || {};
					var create = {'uid': client.UID, 'play': true, 'a': [], 'goc': cuoc, 'cuoc': cuoc, 'bet': cuoc, 'time': new Date()};  // Dữ liệu tạo phiên mới
					var addQuy = (cuoc*0.01)>>0;                 // Thêm vào hũ
					var uInfo     = {};                         // đối tượng cập nhật người dùng
					var uInfoGame = {};
					if (red){
						user.red    -= cuoc;
						user.redPlay = user.redPlay*1 + cuoc;
					}else{
						user.xu    -= cuoc;
						user.xuPlay = user.xuPlay*1 + cuoc;
					}
					user.save();

					CaoThap_user.updateOne({'uid': client.UID}, {$inc: uInfoGame}).exec();

					HU.findOneAndUpdate({game:'caothap', type:cuoc, red:red}, {$inc:{bet:addQuy}}, function(err, caothap){
						var checkName = (client.profile.name == caothap.name);

						if (checkName) {
							var card = [...base_card.card]
								.slice(0, 4);
						}else{
							var card = [...base_card.card];
						}
						// tráo bài
						card = Helpers.shuffle(card); // tráo bài lần 1
						card = Helpers.shuffle(card); // tráo bài lần 2
						card = Helpers.shuffle(card); // tráo bài lần 3

						create['card'] = card[0]; // Lấy bài ra

						if (create['card'].card == 0) {
							// Nếu là A , thêm vào tích lũy A
							create['a'].push(create['card']);
						}

						var up   = create['card'].card != 0;
						var down = create['card'].card != 1;

						if (create['card'].card == 0) {
							var winUp   = 0;     // Hệ số ăn Cao
							var winDown = cuoc;  // Hệ số ăn Thấp
						} else if(create['card'].card == 1){
							var winUp   = cuoc;    // Hệ số ăn Cao
							var winDown = 0;  // Hệ số ăn Thấp
						}else{
							var hesoPhien = HeSo.getT(create['card'].card, 1);
							var winUp   = cuoc+(cuoc*hesoPhien.up)>>0;    // Hệ số ăn Cao
							var winDown = cuoc+(cuoc*hesoPhien.down)>>0;  // Hệ số ăn Thấp
						}
						if (red) {
							CaoThap_red.create(create, function (err, small) {
								client.caothap.id = small._id.toString();
							});
						}else{
							CaoThap_xu.create(create, function (err, small) {
								client.caothap.id = small._id.toString();
							});
						}

						client.red({mini:{caothap:{status:1, card:create['card'], a: create['a'], win: true, bet: cuoc, winUp: winUp, winDown: winDown, click:{isAnNon: false, down: down, up: up}}}, user:{red: user.red, xu: user.xu}});
						client.caothap.red  = red;
						client.caothap.time = setTimeout(function(){
							var select = (Math.random()*2)>>0;
							playGame(client, !!select);
						}, 120000);
					});
				}
			});
		}
	}
}

function playGame(client, select) {
	select = !!select;
	if (void 0 !== client.caothap) {
		if (client.caothap.red) {
			var action = new Promise((ketqua, loi)=>{
				CaoThap_red.findOne({'_id': client.caothap.id}, {}, function(err, user){
					ketqua(user)
				})
			})
		}else{
			var action = new Promise((ketqua, loi)=>{
				CaoThap_xu.findOne({'_id': client.caothap.id}, {}, function(err, user){
					ketqua(user)
				})
			})
		}
		action.then(result =>{
			if (!!result) {
				result = result._doc;
				if (result.play) {
					if (!select && result.card.card == 1) {
						// Không thể thấp hơn
						client.red({mini:{caothap:{down: false, up: true, notice:'Không thể chọn thấp hơn 2'}}});
					}else if (select && result.card.card == 0) {
						// Không thể cao hơn
						client.red({mini:{caothap:{down: true, up: false, notice:'Không thể chọn cao hơn A'}}});
					}else{
						clearTimeout(client.caothap.time);
						client.caothap.time = setTimeout(function(){
							var select = (Math.random()*2)>>0;
							playGame(client, !!select);
						}, 120000);
						var up        = false; // Cho phép chọn trên
						var down      = false; // Cho phép chọn dưới
						var isAnNon   = true;  // Được phép ăn non ?
						var statusWin = false; // Ván chơi có đc tiếp tục hay ko
						var hoa       = false; // Hòa
						var phe       = client.caothap.red ? 2 : 4;    // Phế
						var bet       = result.bet;     // Vốn
						var uInfo     = {};
						var uInfoGame = {};

						var winUp   = 0; // Vốn Cao
						var winDown = 0; // Hệ số ăn Thấp
						HU.findOne({game:'caothap', type:result.goc, red:client.caothap.red}, {}, function(err, caothap){
							if (!!caothap) {
								var checkName = (client.profile.name == caothap.name);
								if (checkName) {
									var card = [...base_card.card]
										.slice(0, 4);
								}else{
									var card = [...base_card.card];
								}
								// loại bỏ trùng lặp
								var vitriX = (result.card.card*4)+result.card.type;
								card.splice(vitriX, 1);

								// tráo bài
								card = Helpers.shuffle(card); // tráo bài lần 1
								card = Helpers.shuffle(card); // tráo bài lần 2
								card = Helpers.shuffle(card); // tráo bài lần 3

								card = card[0]; // Lấy bài ra
								var hesoAn = 0;

								if (card.card == 0) {
									// Nếu là A , thêm vào tích lũy A
									result.a.push(card);
								}

								var hientai = HeSo.getT(result.card.card, result.buoc+1);

								if (select && (card.card > result.card.card || (card.card == 0))) {
									// Đánh cao
									// Chọn đúng
									statusWin = true;
									if (result.card.card != 0 && result.card.card != 1) {
										hesoAn = hientai.up; // Hệ số ăn
									}
								}else if (!select && ((card.card < result.card.card && card.card != 0) || card.card == 1 || (result.card.card == 0 && card.card != 0))) {
									// Đánh thấp
									// Chọn đúng
									statusWin = true;
									if (result.card.card != 0 && result.card.card != 1) {
										hesoAn = hientai.down; // Hệ số ăn
									}
								}else if (result.card.card == card.card) {
									// Cùng ra bài cũ
									statusWin = hoa = true;
								}

								var create = {'uid': client.UID, 'id': result.id, 'cuoc': result.bet, 'bet': 0, 'buoc': result.buoc+1, 'chon': select+1, 'card1': result.card, 'card2': card, 'time': new Date()};  // Dữ liệu bước

								if (statusWin) {
									// Thắng
									if (!hoa) {
										bet = bet+(bet*hesoAn)>>0;           // Cắt phế thắng
									}else{
										var addQuy = (Math.ceil(bet*10/100))>>0;
										bet = (bet-addQuy)>>0; // Hoà , trừ 10% vốn
										HU.updateOne({game:'caothap', type:result.goc, red:client.caothap.red}, {$inc:{bet:addQuy}}).exec();
									}

									up   = card.card != 0;
									down = card.card != 1;
									if (card.card == 0) {
										winUp   = 0;   // Hệ số ăn Cao
										winDown = bet; // Hệ số ăn Thấp
									}else if (card.card == 1){
										winUp   = bet;   // Hệ số ăn Cao
										winDown = 0; // Hệ số ăn Thấp
									}else{
										var tuonglai = HeSo.getT(card.card, result.buoc+2);
										winUp   = bet+(bet*tuonglai.up)>>0;   // Hệ số ăn Cao
										winDown = bet+(bet*tuonglai.down)>>0; // Hệ số ăn Thấp
									}

									if (result.a.length == 3) {
										// Tích lũy A = 3 => Nổ Hũ
										clearTimeout(client.caothap.time);
										client.caothap.play = false;
										HU.updateOne({game:'caothap', type: result.goc, red:client.caothap.red}, {$set:{name:'', bet: caothap.min}}).exec();
										var nohu = create.bet = (caothap.bet-Math.ceil(caothap.bet*phe/100))>>0;

										if (client.caothap.red){
											uInfo['red']    = nohu;            // Cập nhật Số dư Red trong tài khoản
											uInfo['redWin'] = uInfoGame['win'] = nohu-result.goc; // Cập nhật Số Red đã Thắng
											CaoThap_red.updateOne({'_id': client.caothap.id}, {$set: {play: false, cuoc: result.bet, bet: nohu, card: card, a: result.a, time: new Date()}, $inc: {buoc:1}}).exec();
											CaoThap_redbuoc.create(create);
											Helpers.ThongBaoNoHu(client.redT, {title:'Trên Dưới', name: client.profile.name, bet: Helpers.numberWithCommas(nohu)});
										}else{
											uInfo['xu']    = nohu;            // Cập nhật Số dư XU trong tài khoản
											uInfo['xuWin'] = uInfoGame['winXu'] = nohu-result.goc; // Cập nhật Số XU đã Thắng
											CaoThap_xu.updateOne({'_id': client.caothap.id}, {$set: {play: false, cuoc: result.bet, bet: nohu, card: card, a: result.a, time: new Date()}, $inc: {buoc:1}}).exec();
											CaoThap_xubuoc.create(create);
										}
										UserInfo.findOneAndUpdate({id:client.UID}, {$inc: uInfo}, function(err, user){
											client.red({mini:{caothap:{status:1, card:card, a: result.a, win: statusWin, bet: bet, winUp: 0, winDown: 0, nohu: nohu, click:{isAnNon: false, down: false, up: false}}}, user:{red: client.caothap.red ? user.red*1+nohu : user.red, xu: !client.caothap.red ? user.xu*1+nohu : user.xu}});
										});
										CaoThap_user.updateOne({'uid': client.UID}, {$inc: uInfoGame}).exec();
										return void 0;
									}
									create.bet = bet;
								}else{
									// Thua phiên chơi kết thúc
									clearTimeout(client.caothap.time);
									isAnNon = false;
									if (client.caothap.red){
										uInfo['redLost'] = uInfoGame['lost'] = result.goc; // Cập nhật Số Red đã Thua
									}else{
										uInfo['xuLost']  = uInfoGame['lostXu'] = result.goc; // Cập nhật Số XU đã Thua
									}
									UserInfo.updateOne({id:client.UID}, {$inc: uInfo}).exec();
									CaoThap_user.updateOne({'uid': client.UID}, {$inc: uInfoGame}).exec();
								}
								if (client.caothap.red) {
									CaoThap_red.updateOne({'_id': client.caothap.id}, {$set: {play: statusWin, cuoc: result.bet, bet: statusWin ? bet : 0, card: card, a: result.a, time: new Date()}, $inc: {buoc:1}}).exec();
									CaoThap_redbuoc.create(create);
								}else{
									CaoThap_xu.updateOne({'_id': client.caothap.id}, {$set: {play: statusWin, cuoc: result.bet, bet: statusWin ? bet : 0, card: card, a: result.a, time: new Date()}, $inc: {buoc:1}}).exec();
									CaoThap_xubuoc.create(create);
								}
								client.red({mini:{caothap:{status:1, card:card, a: result.a, win: statusWin, bet: bet, winUp: winUp, winDown: winDown, click:{isAnNon: isAnNon, down: down, up: up}}}});
							}
						});
					}
				}else{
					client.red({mini:{caothap:{status:0, notice:'Phiên đã kết thúc...'}}});
				}
			}else{
				client.red({mini:{caothap:{status:0, notice:'Phiên không tồn tại...'}}});
			}
		})
	}else{
		client.red({mini:{caothap:{status:0, notice:'Phiên chơi đã kết thúc...'}}});
	}
}

function annon(client) {
	if (void 0 !== client.caothap) {
		if (client.caothap.red) {
			var action = new Promise((ketqua, loi)=>{
				CaoThap_red.findOne({'_id': client.caothap.id}, {}, function(err, user){
					ketqua(user)
				})
			})
		}else{
			var action = new Promise((ketqua, loi)=>{
				CaoThap_xu.findOne({'_id': client.caothap.id}, {}, function(err, user){
					ketqua(user)
				})
			})
		}
		action.then(result =>{
			if (!!result) {
				result = result._doc;
				if (result.play) {
					if (result.buoc > 0) {
						clearTimeout(client.caothap.time);
						var uInfo     = {};
						var uInfoGame = {};
						if (client.caothap.red){
							uInfo['red']    = result.bet; // Cập nhật Số dư Red trong tài khoản
							var tien = result.bet-result.goc;
							if (tien != 0) {
								if (tien > 0) {
									// lãi
									uInfo['redWin'] = uInfoGame['win'] = tien;
								}else{
									// lỗ
									uInfo['redLost'] = uInfoGame['lost'] = -tien;
								}
							}
							CaoThap_red.updateOne({'_id': client.caothap.id}, {$set: {play: false, time: new Date()}}).exec();
						}else{
							uInfo['xu']    = result.bet; // Cập nhật Số dư XU trong tài khoản
							var tien = result.bet-result.goc;
							if (tien != 0) {
								if (tien > 0) {
									// lãi
									uInfo['xuWin'] = uInfoGame['winXu'] = tien;
								}else{
									// lỗ
									uInfo['xuLost'] = uInfoGame['lostXu'] = -tien;
								}
							}
							CaoThap_xu.updateOne({'_id': client.caothap.id}, {$set: {play: false, time: new Date()}}).exec();
						}
						UserInfo.updateOne({id:client.UID}, {$inc: uInfo}).exec();
						client.red({mini:{caothap:{status:0, annon: result.bet}}});
						CaoThap_user.updateOne({'uid': client.UID}, {$inc: uInfoGame}).exec();
					}else{
						client.red({mini:{caothap:{isAnNon: false, notice:'Chưa đủ điều kiện ăn non...'}}});
					}
				}
			}
		})
	}
}

function reconnect(client){
	var action = new Promise((ketqua, loi)=>{
		CaoThap_red.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, redLast) {
			if (!!redLast && redLast.play){
				client.caothap = client.caothap || {};
				client.caothap.id  = redLast._id.toString();
				client.caothap.red = true;
				ketqua(redLast._doc);
			}else{
				CaoThap_xu.findOne({'uid': client.UID}, {}, {sort:{'_id':-1}}, function(err, xuLast) {
					if (!!xuLast && xuLast.play){
						client.caothap = client.caothap || {};
						client.caothap.id  = xuLast._id.toString();
						client.caothap.red = false;
						ketqua(xuLast._doc);
					}else{
						ketqua(null);
					}
				})
			}
		})
	})
	action.then(result =>{
		if (!!result) {
			var time_remain = ((result.time-(new Date-120000))/1000)>>0;
			if (time_remain >= 0) {
				var up   = result.card.card != 0;
				var down = result.card.card != 1;
				var bet  = result.bet;
				var phe  = client.caothap.red ? 2 : 4;    // Phế

				var winUp = ((result.card.card-1)*16.67)/100;     // Hệ số ăn Cao
				//winUp = winUp < 0 ? 0 : winUp;
				if (winUp < 0) {
					winUp = result.card.card == 0 ? 0 : bet;
				}else{
					winUp = ((bet-Math.ceil(bet*phe/100))*winUp)>>0; // Cắt phế thắng Cao
					winUp = bet+winUp;               // Vốn Cao
				}

				var winDown = ((13-result.card.card)*16.67)/100;      // Hệ số ăn Thấp
				if (winDown >= 2) {
					winDown = result.card.card == 0 ? bet : 0;
				}else{
					winDown = ((bet-Math.ceil(bet*phe/100))*winDown)>>0; // Cắt phế thắng Thấp
					winDown = bet+winDown;               // Vốn Thấp
				}
				var isAnNon = (result.buoc > 0);
				client.red({mini:{caothap:{reconnect: {red: client.caothap.red, cuoc: result.goc, time_remain: time_remain, card:result.card, a: result.a, bet: bet, winUp: winUp, winDown: winDown, click:{isAnNon: isAnNon, down: down, up: up}}}}});

				client.caothap.time = setTimeout(function(){
					var select = (Math.random()*2)>>0;
					playGame(client, !!select);
				}, 121000);
			}else{
				var uInfo     = {};
				var uInfoGame = {};
				if (client.caothap.red){
					uInfo['red']    = result.bet; // Cập nhật Số dư Red trong tài khoản
					var tien = result.bet-result.goc;
					if (tien != 0) {
						if (tien > 0) {
							// lãi
							uInfo['redWin'] = uInfoGame['win'] = tien;
						}else{
							// lỗ
							uInfo['redLost'] = uInfoGame['lost'] = -tien;
						}
					}
					CaoThap_red.updateOne({'_id': client.caothap.id}, {$set: {play: false}}).exec();
				}else{
					uInfo['xu']    = result.bet; // Cập nhật Số dư XU trong tài khoản
					var tien = result.bet-result.goc;
					if (tien != 0) {
						if (tien > 0) {
							// lãi
							uInfo['xuWin'] = uInfoGame['winXu'] = tien;
						}else{
							// lỗ
							uInfo['xuLost'] = uInfoGame['lostXu'] = -tien;
						}
					}
					CaoThap_xu.updateOne({'_id': client.caothap.id}, {$set: {play: false}}).exec();
				}
				UserInfo.updateOne({id:client.UID}, {$inc: uInfo}).exec();
					//client.red({user:{red: client.caothap.red ? user.red*1+result.bet : user.red, xu: !client.caothap.red ? user.xu*1+result.bet : user.xu}});
				//});
				CaoThap_user.updateOne({'uid': client.UID}, {$inc: uInfoGame}).exec();

				if (result.buoc == 0) {
					var create = {'uid': client.UID, 'id': result.id, 'cuoc': result.bet, 'bet': result.bet, 'card1': result.card, 'time': new Date()};  // Dữ liệu bước
					if (client.caothap.red) {
						CaoThap_redbuoc.create(create, function (err, small) {});
					}else{
						CaoThap_xubuoc.create(create, function (err, small) {});
					}
				}
			}
		}
	})
};

module.exports = function(client, data){
	if (!!data.newGame) {
		newGame(client, data.newGame)
	}
	if (void 0 !== data.select) {
		playGame(client, data.select)
	}
	if (!!data.annon) {
		annon(client);
	}
	if (!!data.reconnect) {
		reconnect(client);
	}
};
