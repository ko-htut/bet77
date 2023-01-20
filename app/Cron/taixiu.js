
//let path        = require('path');
let fs          = require('fs');

let Helpers     = require('../Helpers/Helpers');

let UserInfo    = require('../Models/UserInfo');
let TXPhien     = require('../Models/TaiXiu_phien');
let TXCuoc      = require('../Models/TaiXiu_cuoc');
let TaiXiu_User = require('../Models/TaiXiu_user');
let TXCuocOne   = require('../Models/TaiXiu_one');

// Hũ game
let HU_game    = require('../Models/HU');

let bot        = require('./taixiu/bot');
let botList    = [];
let botListCl  = [];

let botHu      = require('./bot_hu');
let botTemp    = [];

let io         = null;
let gameLoop   = null;

let init = function(obj){
	io = obj;

	io.taixiu = {
		chanle: {
			red_chan: 0,
			red_le: 0,
			red_player_chan: 0,
			red_player_le: 0,
			xu_chan: 0,
			xu_le: 0,
			xu_player_chan: 0,
			xu_player_le: 0,
		},
		taixiu: {
			red_player_tai: 0,
			red_player_xiu: 0,
			red_tai: 0,
			red_xiu: 0,
			xu_player_tai: 0,
			xu_player_xiu: 0,
			xu_tai: 0,
			xu_xiu: 0,
		}
	};

	io.taixiuAdmin = {
		chanle: {
			red_chan: 0,
			red_le: 0,
			red_player_chan: 0,
			red_player_le: 0,
			xu_chan: 0,
			xu_le: 0,
			xu_player_chan: 0,
			xu_player_le: 0,
		},
		taixiu: {
			red_player_tai: 0,
			red_player_xiu: 0,
			red_tai: 0,
			red_xiu: 0,
			xu_player_tai: 0,
			xu_player_xiu: 0,
			xu_tai: 0,
			xu_xiu: 0,
		},
		list: []
	};

	playGame();
}

TXPhien.findOne({}, 'id', {sort:{'id':-1}}, function(err, last) {
	if (!!last){
		io.TaiXiu_phien = last.id+1;
	}
})

let truChietKhau = function(bet, phe){
	return bet-Math.ceil(bet*phe/100);
}

// Dữ liệu Hũ
let TopHu = function(){
	HU_game.find({}, 'game type red bet toX balans x').exec(function(err, data){
		if (data.length) {
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				delete obj._id;
				return obj;
			}))
			.then(result => {
				let temp_data = {TopHu: {
					mini_poker: result.filter(function(mini_poker){
						return (mini_poker.game === 'minipoker')
					}),
					big_babol: result.filter(function(big_babol){
						return (big_babol.game === 'bigbabol')
					}),
					vq_red: result.filter(function(vq_red){
						return (vq_red.game === 'vuongquocred')
					}),
					mini3cay: result.filter(function(mini3cay){
						return (mini3cay.game === 'mini3cay')
					}),
					caothap: result.filter(function(caothap){
						return (caothap.game === 'caothap')
					}),
					arb: result.filter(function(arb){
						return (arb.game === 'arb')
					}),
					candy: result.filter(function(candy){
						return (candy.game === 'candy')
					}),
					long: result.filter(function(long){
						return (long.game === 'long')
					}),
					megaj: result.filter(function(megaj){
						return (megaj.game === 'megaj')
					}),
				}};
				io.broadcast(temp_data);
			})
		}
	});
}

let setTaiXiu_user = function(phien, dice){
	TXCuocOne.find({phien: phien}, {}, function(err, list) {
		if (list.length){
			Promise.all(list.map(function(obj){
				let action = new Promise((resolve, reject)=> {
					TaiXiu_User.findOne({uid: obj.uid}, function(error, data) {
						let bet_thua = obj.bet-obj.tralai;
						let bet = obj.win ? obj.betwin+obj.bet : bet_thua;
						let update = {};
						if (obj.taixiu === true && obj.red === true && bet_thua >= 10000) {          // Red Tài Xỉu
							update = {
								tLineWinRed:   obj.win && data.tLineWinRed < data.tLineWinRedH+1 ? data.tLineWinRedH+1 : data.tLineWinRed,
								tLineLostRed:  !obj.win && data.tLineLostRed < data.tLineLostRedH+1 ? data.tLineLostRedH+1 : data.tLineLostRed,
								tLineWinRedH:  obj.win ? data.tLineWinRedH+1 : 0,
								tLineLostRedH: obj.win ? 0 : data.tLineLostRedH+1,
								last:          phien,
							};
							if (obj.win) {
								if (data.tLineWinRedH == 0) {
									update.first = phien;
								}
							}else{
								if (data.tLineLostRedH == 0) {
									update.first = phien;
								}
							}
						} else if (obj.taixiu === true && obj.red === false && bet_thua >= 10000) { // Xu Tài Xỉu
							update = {
								tLineWinXu:   obj.win && data.tLineWinXu < data.tLineWinXuH+1 ? data.tLineWinXuH+1 : data.tLineWinXu,
								tLineLostXu:  !obj.win && data.tLineLostXu < data.tLineLostXuH+1 ? data.tLineLostXuH+1 : data.tLineLostXu,
								tLineWinXuH:  obj.win ? data.tLineWinXuH+1 : 0,
								tLineLostXuH: obj.win ? 0 : data.tLineLostXuH+1,
							}
						} else if (obj.taixiu === false && obj.red === true && bet_thua >= 10000) { // Red Chẵn Lẻ
							update = {
								cLineWinRed:   obj.win && data.cLineWinRed < data.cLineWinRedH+1 ? data.cLineWinRedH+1 : data.cLineWinRed,
								cLineLostRed:  !obj.win && data.cLineLostRed < data.cLineLostRedH+1 ? data.cLineLostRedH+1 : data.cLineLostRed,
								cLineWinRedH:  obj.win ? data.cLineWinRedH+1 : 0,
								cLineLostRedH: obj.win ? 0 : data.cLineLostRedH+1,
							}
						} else if (obj.taixiu === false && obj.red === false && bet_thua >= 10000) { // Xu Chẵn Lẻ
							update = {
								cLineWinXu:   obj.win && data.cLineWinXu < data.cLineWinXuH+1 ? data.cLineWinXuH+1 : data.cLineWinXu,
								cLineLostXu:  !obj.win && data.cLineLostXu < data.cLineLostXuH+1 ? data.cLineLostXuH+1 : data.cLineLostXu,
								cLineWinXuH:  obj.win ? data.cLineWinXuH+1 : 0,
								cLineLostXuH: obj.win ? 0 : data.cLineLostXuH+1,
							}
						}

						!!Object.entries(update).length && TaiXiu_User.updateOne({uid: obj.uid}, {$set:update}).exec();

						if(void 0 !== io.users[obj.uid]){
							io.users[obj.uid].forEach(function(client){
								client.red({taixiu:{status:{win:obj.win, thuong:obj.thuong, select:obj.select, bet: bet}}});
							});
						}
						resolve({uid: obj.uid, red: obj.red, taixiu:obj.taixiu, betwin: obj.betwin});
					});
				});
				return action;
			}))
			.then(values => {
				values = values.filter(function(obj){
					return obj.red && obj.betwin > 0;
				});
				if (values.length) {
					let topTaiXiu = values.filter(function(objTopT){
						return !!objTopT.taixiu;
					});
					let topChanLe = values.filter(function(objTopC){
						return !objTopC.taixiu;
					});
					topTaiXiu.sort(function(a, b){
						return b.betwin-a.betwin;
					});
					topChanLe.sort(function(a, b){
						return b.betwin-a.betwin;
					});
					let top10TX = topTaiXiu.slice(0, 10);
					let top10CL = topChanLe.slice(0, 10);
					values = [...top10TX, ...top10CL];

					values = Helpers.shuffle(values);

					Promise.all(values.map(function(obj){
						let action = new Promise((resolve, reject) => {
							UserInfo.findOne({id: obj.uid}, 'name', function(err, users){
								if (obj.taixiu) {
									resolve({users:users.name, bet:obj.betwin, game:'Tài Xỉu'});
								}else{
									resolve({users:users.name, bet:obj.betwin, game:'Chẵn Lẻ'});
								}
							});
						});
						return action;
					}))
					.then(result => {
						io.sendInHome({news:{a:result}});
					})
				}
			})
		}
	});
}

let thongtin_thanhtoan = function(game_id, dice = false){
	if (dice) {
		let TaiXiu_red_tong_tai   = 0;
		let TaiXiu_red_tong_xiu   = 0;

		let TaiXiu_xu_tong_tai   = 0;
		let TaiXiu_xu_tong_xiu   = 0;

		let ChanLe_red_tong_chan   = 0;
		let ChanLe_red_tong_le     = 0;

		let ChanLe_xu_tong_chan   = 0;
		let ChanLe_xu_tong_le     = 0;

		TXCuoc.find({phien:game_id}, null, {sort:{'_id':-1}}, function(err, list) {
			if(list.length){
				list.forEach(function(objL) {
					if (objL.taixiu === true && objL.red === true && objL.select === true){           // Tổng Red Tài
						TaiXiu_red_tong_tai += objL.bet;
					} else if (objL.taixiu === true && objL.red === true && objL.select === false) {  // Tổng Red Xỉu
						TaiXiu_red_tong_xiu += objL.bet;
					} else if (objL.taixiu === true && objL.red === false && objL.select === true) {  // Tổng Xu Tài
						TaiXiu_xu_tong_tai += objL.bet;
					} else if (objL.taixiu === true && objL.red === false && objL.select === false) { // Tổng Xu Xỉu
						TaiXiu_xu_tong_xiu += objL.bet;
					} else if (objL.taixiu === false && objL.red === true && objL.select === true) {  // Tổng Red Chẵn
						ChanLe_red_tong_chan += objL.bet;
					} else if (objL.taixiu === false && objL.red === true && objL.select === false) {  // Tổng Red Lẻ
						ChanLe_red_tong_le += objL.bet;
					} else if (objL.taixiu === false && objL.red === false && objL.select === true) {  // Tổng xu Chẵn
						ChanLe_xu_tong_chan += objL.bet;
					} else if (objL.taixiu === false && objL.red === false && objL.select === false) { // Tổng xu Lẻ
						ChanLe_xu_tong_le += objL.bet;
					}
				});
				let TaiXiu_tong_red_lech = Math.abs(TaiXiu_red_tong_tai  - TaiXiu_red_tong_xiu);
				let TaiXiu_tong_xu_lech  = Math.abs(TaiXiu_xu_tong_tai   - TaiXiu_xu_tong_xiu);
				let ChanLe_tong_red_lech = Math.abs(ChanLe_red_tong_chan - ChanLe_red_tong_le);
				let ChanLe_tong_xu_lech  = Math.abs(ChanLe_xu_tong_chan  - ChanLe_xu_tong_le);

				let TaiXiu_red_lech_tai  = TaiXiu_red_tong_tai  > TaiXiu_red_tong_xiu ? true : false;
				let TaiXiu_xu_lech_tai   = TaiXiu_xu_tong_tai   > TaiXiu_xu_tong_xiu  ? true : false;
				let ChanLe_red_lech_chan = ChanLe_red_tong_chan > ChanLe_red_tong_le  ? true : false;
				let ChanLe_xu_lech_chan  = ChanLe_xu_tong_chan  > ChanLe_xu_tong_le   ? true : false;

				TaiXiu_red_tong_tai = null;
				TaiXiu_red_tong_xiu = null;

				TaiXiu_xu_tong_tai = null;
				TaiXiu_xu_tong_xiu = null;

				ChanLe_red_tong_chan = null;
				ChanLe_red_tong_le   = null;

				ChanLe_xu_tong_chan = null;
				ChanLe_xu_tong_le   = null;

				Promise.all(list.map(function(obj){
					let oneUpdate  = {};
					if (obj.taixiu === true && obj.red === true && obj.select === true){           // Tổng Red Tài
						let win = dice > 10 ? true : false;
						if (TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
							if (TaiXiu_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_red_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-TaiXiu_tong_red_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = TaiXiu_tong_red_lech;
								TaiXiu_tong_red_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 2);
									obj.betwin    = betwinP;
									let redUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redPlay:betPlay, redWin:betwinP}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwinP, tRedPlay: betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redPlay:betPlay, redLost:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:betPlay, tRedPlay: betPlay}}).exec();
								}
								obj.save();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin    = truChietKhau(obj.bet, 2);
								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let redUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwin, tRedPlay: obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{redLost:obj.bet, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:obj.bet, tRedPlay:obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === true && obj.red === true && obj.select === false) {  // Tổng Red Xỉu
						let win = dice > 10 ? false : true;
						if (!TaiXiu_red_lech_tai && TaiXiu_tong_red_lech > 0) {
							if (TaiXiu_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_red_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-TaiXiu_tong_red_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = TaiXiu_tong_red_lech;
								TaiXiu_tong_red_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 2);
									obj.betwin    = betwinP;
									let redUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redPlay:betPlay, redWin:betwinP}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwinP, tRedPlay:betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redPlay: betPlay, redLost:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:betPlay, tRedPlay:betPlay}}).exec();
								}
								obj.save();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin    = truChietKhau(obj.bet, 2);
								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let redUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinRed:betwin, tRedPlay: obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{redLost:obj.bet, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostRed:obj.bet, tRedPlay:obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === true && obj.red === false && obj.select === true) {  // Tổng Xu Tài
						let win = dice > 10 ? true : false;
						if (TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
							if (TaiXiu_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_xu_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-TaiXiu_tong_xu_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = TaiXiu_tong_xu_lech;
								TaiXiu_tong_xu_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 4);
									obj.betwin = betwinP;
									let thuong = (betwinP*0.039589)>>0;

									oneUpdate.betwin = betwinP;
									oneUpdate.thuong = thuong;

									let xuUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:betwinP, tXuPlay: betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:betPlay, tXuPlay:betPlay}}).exec();
								}
								obj.save();
								oneUpdate.tralai = obj.tralai;
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin = truChietKhau(obj.bet, 4);
								let thuong = (betwin*0.039589)>>0;
								oneUpdate.thuong = thuong;
								oneUpdate.betwin = betwin;

								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let xuUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:obj.bet, tXuPlay:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:obj.bet, tXuPlay: obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === true && obj.red === false && obj.select === false) { // Tổng Xu Xỉu
						let win = dice > 10 ? false : true;
						if (!TaiXiu_xu_lech_tai && TaiXiu_tong_xu_lech > 0) {
							if (TaiXiu_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								TaiXiu_tong_xu_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-TaiXiu_tong_xu_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = TaiXiu_tong_xu_lech;
								TaiXiu_tong_xu_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 4);
									obj.betwin = betwinP;
									let thuong = (betwinP*0.039589)>>0;

									oneUpdate.betwin = betwinP;
									oneUpdate.thuong = thuong;

									let xuUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:betwinP, tXuPlay: betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:betPlay, tXuPlay:betPlay}}).exec();
								}
								obj.save();
								oneUpdate.tralai = obj.tralai;
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin = truChietKhau(obj.bet, 4);
								let thuong = (betwin*0.039589)>>0;
								oneUpdate.thuong = thuong;
								oneUpdate.betwin = betwin;

								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let xuUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tWinXu:obj.bet, tXuPlay:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:true, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{tLostXu:obj.bet, tXuPlay:obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === false && obj.red === true && obj.select === true) {  // Tổng Red Chẵn
						let win = dice%2 ? false : true;
						if (ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
							if (ChanLe_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_red_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-ChanLe_tong_red_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = ChanLe_tong_red_lech;
								ChanLe_tong_red_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 2);
									obj.betwin    = betwinP;
									let redUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwinP, redPlay:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwinP, cRedPlay:betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redLost:betPlay, redPlay:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:betPlay, cRedPlay:betPlay}}).exec();
								}
								obj.save();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin    = truChietKhau(obj.bet, 2);
								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let redUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwin, cRedPlay: obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{redPlay:obj.bet, redLost:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:obj.bet, cRedPlay: obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === false && obj.red === true && obj.select === false) {  // Tổng Red Lẻ
						let win = dice%2 ? true : false;
						if (!ChanLe_red_lech_chan && ChanLe_tong_red_lech > 0) {
							if (ChanLe_tong_red_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_red_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-ChanLe_tong_red_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = ChanLe_tong_red_lech;
								ChanLe_tong_red_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 2);
									obj.betwin    = betwinP;
									let redUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwinP, redPlay:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwinP, cRedPlay:betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:obj.tralai, redLost:betPlay, redPlay:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:betPlay, cRedPlay:betPlay}}).exec();
								}
								obj.save();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:win}, $inc:{tralai:obj.tralai, betwin:betwinP}}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin    = truChietKhau(obj.bet, 2);
								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let redUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:redUpdate, redWin:betwin, redPlay:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinRed:betwin, cRedPlay: obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:true}, {$set:{win:true}, $inc:{betwin:betwin}}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{redPlay:obj.bet, redLost:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostRed:obj.bet, cRedPlay:obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === false && obj.red === false && obj.select === true) {  // Tổng xu Chẵn
						let win = dice%2 ? false : true;
						if (ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
							if (ChanLe_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_xu_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-ChanLe_tong_xu_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = ChanLe_tong_xu_lech;
								ChanLe_tong_xu_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 4);
									obj.betwin = betwinP;
									let thuong = (betwinP*0.039589)>>0;

									oneUpdate.betwin = betwinP;
									oneUpdate.thuong = thuong;

									let xuUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:betwinP, cXuPlay: betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:betPlay, cXuPlay:betPlay}}).exec();
								}
								obj.save();
								oneUpdate.tralai = obj.tralai;
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
							}
						}else{
							if (win) {
								let betwin = truChietKhau(obj.bet, 4);
								let thuong = (betwin*0.039589)>>0;
								oneUpdate.thuong = thuong;
								oneUpdate.betwin = betwin;

								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let xuUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:obj.bet, cXuPlay:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:true, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:obj.bet, cXuPlay:obj.bet}}).exec();
							}
						}
					} else if (obj.taixiu === false && obj.red === false && obj.select === false) { // Tổng xu Lẻ
						let win = dice%2 ? true : false;
						if (!ChanLe_xu_lech_chan && ChanLe_tong_xu_lech > 0) {
							if (ChanLe_tong_xu_lech >= obj.bet) {
								// Trả lại hoàn toàn
								ChanLe_tong_xu_lech -= obj.bet
								// trả lại hoàn toàn
								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = obj.bet;
								obj.save();
								UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:{tralai:obj.bet}}).exec();
							}else{
								// Trả lại 1 phần
								let betPlay = obj.bet-ChanLe_tong_xu_lech;
								let betwinP = 0;

								obj.thanhtoan = true;
								obj.win       = win;
								obj.tralai    = ChanLe_tong_xu_lech;
								ChanLe_tong_xu_lech = 0;

								if (win) {
									// Thắng nhưng bị trừ tiền trả lại
									// cộng tiền thắng
									betwinP = truChietKhau(betPlay, 4);
									obj.betwin = betwinP;
									let thuong = (betwinP*0.039589)>>0;

									oneUpdate.betwin = betwinP;
									oneUpdate.thuong = thuong;

									let xuUpdate = obj.bet+betwinP;
									UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:betPlay, xuWin:betwinP, thuong:thuong}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:betwinP, cXuPlay: betPlay}}).exec();
								}else{
									UserInfo.updateOne({id:obj.uid}, {$inc:{xu:obj.tralai, xuPlay:betPlay, xuLost:betPlay}}).exec();
									TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:betPlay, cXuPlay:betPlay}}).exec();
								}
								obj.save();
								oneUpdate.tralai = obj.tralai;
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:win}, $inc:oneUpdate}).exec();
							}
						}else{
							if (win) {
								// cộng tiền thắng hoàn toàn
								let betwin = truChietKhau(obj.bet, 4);
								let thuong = (betwin*0.039589)>>0;
								oneUpdate.thuong = thuong;
								oneUpdate.betwin = betwin;

								obj.thanhtoan = true;
								obj.win       = true;
								obj.betwin    = betwin;
								obj.save();

								let xuUpdate = obj.bet+betwin;
								UserInfo.updateOne({id:obj.uid}, {$inc:{red:thuong, xu:xuUpdate, xuPlay:obj.bet, xuWin:betwin, thuong:thuong}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cWinXu:obj.bet, cXuPlay:obj.bet}}).exec();
								return TXCuocOne.updateOne({uid: obj.uid, phien: game_id, taixiu:false, select:false, red:false}, {$set:{win:true}, $inc:oneUpdate}).exec();
							}else{
								obj.thanhtoan = true;
								obj.save();

								UserInfo.updateOne({id:obj.uid}, {$inc:{xuPlay:obj.bet, xuLost:obj.bet}}).exec();
								TaiXiu_User.updateOne({uid: obj.uid}, {$inc:{cLostXu:obj.bet, cXuPlay:obj.bet}}).exec();
							}
						}
					}
					return 1;
				}))
				.then(function(resultUpdate) {
					playGame();
					setTaiXiu_user(game_id, dice);

					TaiXiu_tong_red_lech = null;
					TaiXiu_tong_xu_lech  = null;
					ChanLe_tong_red_lech = null;
					ChanLe_tong_xu_lech  = null;
					TaiXiu_red_lech_tai  = null;
					TaiXiu_xu_lech_tai   = null;
					ChanLe_red_lech_chan = null;
					ChanLe_xu_lech_chan  = null;
				});
			}else if (dice) {
				playGame();
			}
		});
	}else{
		// Users
		let home = {taixiu:{taixiu:{red_tai: io.taixiu.taixiu.red_tai, red_xiu: io.taixiu.taixiu.red_xiu}}};

		Object.values(io.users).forEach(function(users){
			users.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red({taixiu: io.taixiu});
				}else if(client.scene == 'home'){
					client.red(home);
				}
			});
		});

		// Admin
		Object.values(io.admins).forEach(function(admin){
			admin.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewTaiXiu !== void 0 && client.gameEvent.viewTaiXiu){
					client.red({taixiu: io.taixiuAdmin});
				}
			});
		});

		// Khách
		if (!(io.TaiXiu_time%10)) {
			io.sendAllClient(home);
		}
	}
}

let playGame = function(){
	io.TaiXiu_time = 77;

	//io.TaiXiu_time = 82;
	//io.TaiXiu_time = 10

	gameLoop = setInterval(function(){
		if (!(io.TaiXiu_time%5)) {
			// Hũ
			TopHu();
		}

		io.TaiXiu_time--;
		if (io.TaiXiu_time <= 60) {
			if (io.TaiXiu_time < 0) {
				clearInterval(gameLoop);
				io.TaiXiu_time = 0;

				fs.readFile('./data/taixiu.json', 'utf8', (errjs, taixiujs) => {
					try {
						taixiujs = JSON.parse(taixiujs);

						let dice1 = parseInt(taixiujs.dice1 == 0 ? Math.floor(Math.random() * 6) + 1 : taixiujs.dice1);
						let dice2 = parseInt(taixiujs.dice2 == 0 ? Math.floor(Math.random() * 6) + 1 : taixiujs.dice2);
						let dice3 = parseInt(taixiujs.dice3 == 0 ? Math.floor(Math.random() * 6) + 1 : taixiujs.dice3);

						taixiujs.dice1  = 0;
						taixiujs.dice2  = 0;
						taixiujs.dice3  = 0;
						taixiujs.uid    = '';
						taixiujs.rights = 2;

						fs.writeFile('./data/taixiu.json', JSON.stringify(taixiujs), function(err){});

						TXPhien.create({'dice1':dice1, 'dice2':dice2, 'dice3':dice3, 'time':new Date()}, function(err, create){
							if (!!create) {
								io.TaiXiu_phien = create.id+1;
								thongtin_thanhtoan(create.id, dice1+dice2+dice3);
								io.sendAllUser({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}});

								Object.values(io.admins).forEach(function(admin){
									admin.forEach(function(client){
										client.red({taixiu: {finish:{dices:[create.dice1, create.dice2, create.dice3], phien:create.id}}});
									});
								});
								dice1 = null;
								dice2 = null;
								dice3 = null;
							}
						});
					} catch (error) {
						//console.log(error);
					}
				});

				io.taixiu = {
					chanle: {
						red_chan: 0,
						red_le: 0,
						red_player_chan: 0,
						red_player_le: 0,
						xu_chan: 0,
						xu_le: 0,
						xu_player_chan: 0,
						xu_player_le: 0,
					},
					taixiu: {
						red_player_tai: 0,
						red_player_xiu: 0,
						red_tai: 0,
						red_xiu: 0,
						xu_player_tai: 0,
						xu_player_xiu: 0,
						xu_tai: 0,
						xu_xiu: 0,
					}
				};

				io.taixiuAdmin = {
					chanle: {
						red_chan: 0,
						red_le: 0,
						red_player_chan: 0,
						red_player_le: 0,
						xu_chan: 0,
						xu_le: 0,
						xu_player_chan: 0,
						xu_player_le: 0,
					},
					taixiu: {
						red_player_tai: 0,
						red_player_xiu: 0,
						red_tai: 0,
						red_xiu: 0,
						xu_player_tai: 0,
						xu_player_xiu: 0,
						xu_tai: 0,
						xu_xiu: 0,
					},
					list: []
				};

				fs.readFile('./config/taixiu.json', 'utf8', (errcf, taixiucf) => {
					try {
						taixiucf = JSON.parse(taixiucf);
						
						if (taixiucf.bot) {
							// lấy danh sách tài khoản bot
							UserInfo.find({type: true}, 'id name', function(err, list){
								if (list.length) {
									Promise.all(list.map(function(user){
										user = user._doc;
										delete user._id;
										return user;
									}))
									.then(result => {
										botTemp = [...result];
										let maxBot = (result.length*70/100)>>0;
										botList = Helpers.shuffle(result); // tráo bot;
										botList = botList.slice(0, maxBot);

										maxBot = (result.length*50/100)>>0;
										botListCl = Helpers.shuffle(result); // tráo bot;
										botListCl = botListCl.slice(0, maxBot);
									});
								}
							});
						}else{
							botTemp = [];
							botList = [];
							botListCl = [];
						}
					} catch (error) {
						botTemp = [];
						botList = [];
						botListCl = [];
					}
				});
			}else{
				thongtin_thanhtoan(io.TaiXiu_phien);
				if (!!botList.length && io.TaiXiu_time > 2) {
					let timeBot = (Math.floor(Math.random()*(6-2+1))+2)>>0;
					if (!(io.TaiXiu_time%timeBot)) {
						let userCuoc = (Math.random()*7)>>0;
						let iH = 0;
						for (iH = 0; iH < userCuoc; iH++) {
							let dataT = botList[iH];
							if (!!dataT) {
								bot.tx(dataT, io);
								botList.splice(iH, 1); // Xoá bot đã đặt tránh trùng lặp
							}
							dataT = null;
						}
					}
					timeBot = (Math.floor(Math.random()*(6-2+1))+2)>>0;
					if (!(io.TaiXiu_time%timeBot)) {
						let userCuocCL = (Math.random()*7)>>0;
						let iHCL = 0;
						for (iHCL = 0; iHCL < userCuocCL; iHCL++) {
							let dataT = botListCl[iHCL];
							if (!!dataT) {
								bot.cl(dataT, io);
								botListCl.splice(iHCL, 1); // Xoá bot đã đặt tránh trùng lặp
							}
							dataT = null;
						}
					}
				}
			}
		}
		botHu(io, botTemp);
	}, 1000);
	return gameLoop;
}

module.exports = init;
