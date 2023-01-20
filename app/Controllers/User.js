
let User     = require('../Models/Users');
let UserInfo = require('../Models/UserInfo');
let Phone    = require('../Models/Phone');

// Game User
let TaiXiu_User     = require('../Models/TaiXiu_user');
let MiniPoker_User  = require('../Models/miniPoker/miniPoker_users');
let Bigbabol_User   = require('../Models/BigBabol/BigBabol_users');
let VQRed_User      = require('../Models/VuongQuocRed/VuongQuocRed_users');
let BauCua_User     = require('../Models/BauCua/BauCua_user');
let Mini3Cay_User   = require('../Models/Mini3Cay/Mini3Cay_user');
let CaoThap_User    = require('../Models/CaoThap/CaoThap_user');
let AngryBirds_user = require('../Models/AngryBirds/AngryBirds_user');
let Candy_user      = require('../Models/Candy/Candy_user');
let LongLan_user    = require('../Models/LongLan/LongLan_user');
let XocXoc_user     = require('../Models/XocXoc/XocXoc_user');

let MegaJP_user     = require('../Models/MegaJP/MegaJP_user');

let Message         = require('../Models/Message');

let validator   = require('validator');
let Helper      = require('../Helpers/Helpers');
let onHistory   = require('./user/onHistory');
let ket_sat     = require('./user/ket_sat');

let next_scene  = require('./user/next_scene');
let security    = require('./user/security');

let nhanthuong  = require('./user/nhanthuong');

let GameState = require('./GameState.js')

let first = function(client){
	UserInfo.findOne({id: client.UID}, 'name lastVip redPlay red xu ketSat UID cmt email security joinedOn', function(err, user) {
		if (!!user) {
			user = user._doc;
			let vipHT = ((user.redPlay-user.lastVip)/100000)>>0; // Điểm vip Hiện Tại
			// Cấp vip hiện tại
			let vipLevel = 1;
			let vipPre   = 0;   // Điểm víp cấp Hiện tại
			let vipNext  = 100; // Điểm víp cấp tiếp theo
			if (vipHT >= 120000) {
				vipLevel = 9;
				vipPre   = 120000;
				vipNext  = 0;
			}else if (vipHT >= 50000){
				vipLevel = 8;
				vipPre   = 50000;
				vipNext  = 120000;
			}else if (vipHT >= 15000){
				vipLevel = 7;
				vipPre   = 15000;
				vipNext  = 50000;
			}else if (vipHT >= 6000){
				vipLevel = 6;
				vipPre   = 6000;
				vipNext  = 15000;
			}else if (vipHT >= 3000){
				vipLevel = 5;
				vipPre   = 3000;
				vipNext  = 6000;
			}else if (vipHT >= 1000){
				vipLevel = 4;
				vipPre   = 1000;
				vipNext  = 3000;
			}else if (vipHT >= 500){
				vipLevel = 3;
				vipPre   = 500;
				vipNext  = 1000;
			}else if (vipHT >= 100){
				vipLevel = 2;
				vipPre   = 100;
				vipNext  = 500;
			}
			user.level   = vipLevel;
			user.vipNext = vipNext-vipPre;
			user.vipHT   = vipHT-vipPre;

			delete user._id;
			delete user.redPlay;
			delete user.lastVip;

			if (!Helper.isEmpty(user.email)) {
				user.email = Helper.cutEmail(user.email)
			}

			client.profile = {name: user.name};

			addToListOnline(client);

			Phone.findOne({uid:client.UID}, {}, function(err2, dataP){
				user.phone = dataP ? Helper.cutPhone(dataP.region+dataP.phone) : '';
				let data = {
					Authorized: true,
					user:       user,
				};
				Message.countDocuments({uid:client.UID, read: false}).exec(function(errMess, countMess){
					data.message = {news:countMess};
					client.red(data);
					GameState(client);
				});
			})
		}else{
			client.red({Authorized: false});
		}
	});
}

let updateCoint = function(client){
	UserInfo.findOne({id:client.UID}, 'red xu', function(err, user){
		if (!!user) {
			client.red({user: {red: user.red, xu: user.xu}});
		}
	});
}

let signName = function(client, name){
	if (!!name) {
		name = ''+name+'';
		let az09     = new RegExp('^[a-zA-Z0-9]+$');
		let testName = az09.test(name);

		if (!validator.isLength(name, {min: 3, max: 14})) {
			client.red({notice: {title: 'TÊN NHÂN VẬT', text: 'Độ dài từ 3 đến 14 ký tự !!'}});
		}else if (!testName) {
			client.red({notice: {title: 'TÊN NHÂN VẬT', text: 'Tên không chứa ký tự đặc biệt !!'}});
		} else{
			UserInfo.findOne({id: client.UID}, 'name red xu ketSat UID phone email cmt security joinedOn', function(err, d){
				if (!d) {
					name = name.toLowerCase();
					User.findOne({'_id':client.UID}, function(err, base){
						var regex = new RegExp('^' + base.local.username + '$', 'i');
						var testBase = regex.test(name);
						if (testBase) {
							client.red({notice: {title: 'TÊN NHÂN VẬT', text: 'Tên nhân vật không được trùng với tên đăng nhập...'}});
						}else{
							UserInfo.findOne({'name':name}, 'name', function(err, check){
								if (!!check) {
									client.red({notice: {title: 'TÊN NHÂN VẬT', text: 'Tên nhân vật đã tồn tại...'}});
								}else{
									try {
										UserInfo.create({'id':client.UID, 'name':name, 'joinedOn':new Date()}, function(errC, user){
											if (!!errC) {
												client.red({notice:{load: 0, title: 'LỖI', text: 'Tên nhân vật đã tồn tại.'}});
											}else{
												user = user._doc;
												user.level   = 1;
												user.vipNext = 100;
												user.vipHT   = 0;
												user.phone   = '';

												delete user._id;
												delete user.redWin;
												delete user.redLost;
												delete user.redPlay;
												delete user.xuWin;
												delete user.xuLost;
												delete user.xuPlay;
												delete user.thuong;
												delete user.vip;
												delete user.hu;
												delete user.huXu;

												addToListOnline(client);

												let data = {
													Authorized: true,
													user: user,
													message:{news:1},
												};
												client.profile = {name: user.name};
												
												TaiXiu_User.create({'uid': client.UID});
												MiniPoker_User.create({'uid': client.UID});
												Bigbabol_User.create({'uid': client.UID});
												VQRed_User.create({'uid': client.UID});
												BauCua_User.create({'uid': client.UID});
												Mini3Cay_User.create({'uid': client.UID});
												CaoThap_User.create({'uid': client.UID});
												AngryBirds_user.create({'uid': client.UID});
												Candy_user.create({'uid': client.UID});
												LongLan_user.create({'uid': client.UID});
												XocXoc_user.create({'uid': client.UID});
												MegaJP_user.create({'uid': client.UID});

												Message.create({'uid': client.UID, 'title':'Thành Viên Mới', 'text':'Chào mừng bạn đến với Bem68.com, chúc bạn chơi game vui vẻ...', 'time':new Date()});

												GameState(client);
												client.red(data);
											}
										});
									} catch (error) {
										client.red({notice: {title: 'TÊN NHÂN VẬT', text: 'Tên nhân vật đã tồn tại...'}});
									}
								}
							})
						}
					});
				}else{
					first(client);
				}
			});
		}
	}
}

let changePassword = function(client, data){
	if (!!data && !!data.passOld && !!data.passNew && !!data.passNew2) {
		if (!validator.isLength(data.passOld, {min: 6, max: 32})) {
			client.red({notice: {title: 'LỖI', text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.passNew, {min: 6, max: 32})) {
			client.red({notice: {title: 'LỖI', text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.passNew2, {min: 6, max: 32})) {
			client.red({notice: {title: 'LỖI', text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		} else if (data.passOld == data.passNew){
			client.red({notice: {title: 'LỖI', text: 'Mật khẩu mới không trùng với mật khẩu cũ.!!'}});
		} else if (data.passNew != data.passNew2){
			client.red({notice: {title: 'LỖI', text: 'Nhập lại mật khẩu không đúng.!!'}});
		} else {
			User.findOne({'_id': client.UID}, function(err, user){
				if (!!user) {
					if (user.local.username == data.passNew) {
						client.red({notice: {title: 'LỖI', text: 'Mật khẩu không được trùng với tên đăng nhập.!!'}});
					}else{
						if (Helper.validPassword(data.passOld, user.local.password)) {
							User.updateOne({'_id': client.UID}, {$set:{'local.password': Helper.generateHash(data.passNew)}}).exec();
							client.red({notice:{load: 0, title: 'THÀNH CÔNG', text:'Đổi mật khẩu thành công.'}});
						}else{
							client.red({notice:{load: 0, title: 'THẤT BẠI', text:'Mật khẩu cũ không đúng.'}});
						}
					}
				}
			});
		}
	}
}

let getLevel = function(client){
	UserInfo.findOne({id:client.UID}, 'lastVip redPlay vip', function(err, user){
		if (user) {
			var vipHT = ((user.redPlay-user.lastVip)/100000)>>0; // Điểm vip Hiện Tại
			// Cấp vip hiện tại
			var vipLevel = 1;
			var vipPre   = 0; // Điểm víp cấp Hiện tại
			var vipNext  = 100; // Điểm víp cấp tiếp theo
			if (vipHT >= 120000) {
				vipLevel = 9;
				vipPre   = 120000;
				vipNext  = 0;
			}else if (vipHT >= 50000){
				vipLevel = 8;
				vipPre   = 50000;
				vipNext  = 120000;
			}else if (vipHT >= 15000){
				vipLevel = 7;
				vipPre   = 15000;
				vipNext  = 50000;
			}else if (vipHT >= 6000){
				vipLevel = 6;
				vipPre   = 6000;
				vipNext  = 15000;
			}else if (vipHT >= 3000){
				vipLevel = 5;
				vipPre   = 3000;
				vipNext  = 6000;
			}else if (vipHT >= 1000){
				vipLevel = 4;
				vipPre   = 1000;
				vipNext  = 3000;
			}else if (vipHT >= 500){
				vipLevel = 3;
				vipPre   = 500;
				vipNext  = 1000;
			}else if (vipHT >= 100){
				vipLevel = 2;
				vipPre   = 100;
				vipNext  = 500;
			}

			client.red({profile:{level: {level: vipLevel, vipNext: vipNext, vipPre: vipPre, vipTL: user.vip, vipHT: vipHT}}});
		}else{
			client.close();
		}
	});
}

function addToListOnline(client){
	if (void 0 !== client.redT.users[client.UID]) {
		client.redT.users[client.UID].push(client);
	}else{
		client.redT.users[client.UID] = [client];
	}
}

function onData(client, data) {
	if (!!data) {
		if (!!data.doi_pass) {
			changePassword(client, data.doi_pass)
		}
		if (!!data.history) {
			onHistory(client, data.history)
		}
		if (!!data.ket_sat) {
			ket_sat(client, data.ket_sat)
		}
		if (!!data.updateCoint) {
			updateCoint(client);
		}
		if (!!data.getLevel) {
			getLevel(client);
		}
		if (!!data.nhanthuong) {
			nhanthuong(client);
		}
		if (!!data.security) {
			security(client, data.security);
		}
	}
}

module.exports = {
	first:       first,
	signName:    signName,
	onData:      onData,
	next_scene:  next_scene,
	updateCoint: updateCoint,
	getLevel:    getLevel,
}
