
let fs           = require('fs');

let XocXoc_phien = require('../../../Models/XocXoc/XocXoc_phien');
let XocXoc_cuoc  = require('../../../Models/XocXoc/XocXoc_cuoc');
let XocXoc_user  = require('../../../Models/XocXoc/XocXoc_user');

let UserInfo     = require('../../../Models/UserInfo');
let Helpers      = require('../../../Helpers/Helpers');

let XocXoc = function(io){
	this.io           = io;
	this.clients      = {};
	this.time         = 0;
	this.timeInterval = null;
	this.phien        = 1;
	this.botList      = [];
	this.botCount     = 0;

	this.ingame = {red:{}, xu:{}};

	this.chip = {
		'chan':   {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'le':     {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'red3':   {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'red4':   {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'white3': {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
		'white4': {'1000':0, '10000':0, '50000':0, '100000':0, '1000000':0},
	};

	this.data = {
		'red': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
		'xu': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
	};
	this.dataAdmin = {
		'red': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
		'xu': {
			'chan':   0,
			'le':     0,
			'red3':   0,
			'red4':   0,
			'white3': 0,
			'white4': 0,
		},
	};

	let self = this;
	XocXoc_phien.findOne({}, 'id', {sort:{'_id':-1}}, function(err, last) {
		if (!!last){
			self.phien = last.id+1;
		}
		self.play();
		self = null;
	});
}

XocXoc.prototype.play = function(){
	// chạy thời gian

	this.time = 43;

	this.timeInterval = setInterval(function(){
		let self = this;
		if (this.time < 30) {
			if (this.time < 0) {
				clearInterval(this.timeInterval);
				this.time = 0;

				this.resetData();

				this.resetDataAdmin();

				fs.readFile('./data/xocxoc.json', 'utf8', (errjs, xocxocjs) => {
					try {
						xocxocjs = JSON.parse(xocxocjs);

						let red1 = xocxocjs.red1 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red1;
						let red2 = xocxocjs.red2 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red2;
						let red3 = xocxocjs.red3 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red3;
						let red4 = xocxocjs.red4 == 2 ? !!((Math.random()*2)>>0) : xocxocjs.red4;

						xocxocjs.red1 = 2;
						xocxocjs.red2 = 2;
						xocxocjs.red3 = 2;
						xocxocjs.red4 = 2;

						fs.writeFile('./data/xocxoc.json', JSON.stringify(xocxocjs), function(err){});

						XocXoc_phien.create({'red1':red1, 'red2':red2, 'red3':red3, 'red4':red4, 'time':new Date()}, function(err, create){
							if (!!create) {
								self.phien = create.id+1;
								self.thanhtoan([red1, red2, red3, red4]);
								self.timeInterval = null;
								xocxocjs          = null;
								Object.values(self.clients).forEach(function(client){
									client.red({xocxoc:{phien:create.id, finish:[red1, red2, red3, red4]}});
								});
								Object.values(self.io.admins).forEach(function(admin){
									admin.forEach(function(client){
										client.red({xocxoc:{finish:[red1, red2, red3, red4]}});
									});
								});
								self = null;
							}
						});
					} catch (error) {
					}
				});
				/**
				fs.readFile('./config/xocxoc.json', 'utf8', (errXX, bcXX) => {
					try {
						bcXX = JSON.parse(bcXX);
						if (bcXX.bot) {
							// lấy danh sách tài khoản bot
							UserInfo.find({type:true}, 'id name', function(err, blist){
								if (blist.length) {
									Promise.all(blist.map(function(buser){
										buser = buser._doc;
										delete buser._id;

										return buser;
									}))
									.then(result => {
										let maxBot = (result.length*50/100)>>0;
										this.botList = Helpers.shuffle(result);
										this.botList = this.botList.slice(0, maxBot);
									});
								}
							});
						}else{
							this.botList = [];
						}
					} catch (error) {
						this.botList = [];
					}
				});
				*/
			}else{
				this.thanhtoan();
				/**
				if (!!this.botList.length && this.time > 2) {
					let userCuoc = (Math.random()*5)>>0;
					for (let i = 0; i < userCuoc; i++) {
						let dataT = this.botList[i];
						if (!!dataT) {
							this.bot(dataT);
							this.botList.splice(i, 1); // Xoá bot đã đặt tránh trùng lặp
						}
						dataT = null;
					}
				}
				*/
			}
		}
		this.time--;
	}.bind(this), 1000);
	return void 0;
}

XocXoc.prototype.thanhtoan = function(dice = null){
	// thanh toán phiên
	let self = this;
	if (!!dice) {
		let gameChan = 0;     // Là chẵn

		dice.forEach(function(kqH){
			if (kqH) {
				gameChan++;
			}
		});

		let red    = gameChan;
		let white  = 4-gameChan;

		let red3   = (red == 3);   // 3 đỏ
		let red4   = (red == 4);   // 4 đỏ
		let white3 = (white == 3); // 3 trắng
		let white4 = (white == 4); // 4 trắng

		red    = null;
		white  = null;

		gameChan = !(gameChan%2); // game là chẵn

		let phien = this.phien-1;

		XocXoc_cuoc.find({phien:phien}, {}, function(err, list) {
			if (list.length) {
				Promise.all(list.map(function(cuoc){
					let tongDat   = cuoc.chan+cuoc.le+cuoc.red3+cuoc.red4+cuoc.white3+cuoc.white4;
					let TienThang = 0; // Số tiền thắng (chưa tính gốc)
					let TongThua  = 0; // Số tiền thua
					let TongThang = 0; // Tổng tiền thắng (đã tính gốc)
					let thuong    = 0;

					// Cược Chẵn
					if (cuoc.chan > 0) {
						if (gameChan) {
							TienThang += cuoc.chan;
							TongThang += cuoc.chan*2;
						}else{
							TongThua  += cuoc.chan;
						}
					}
					// Cược Lẻ
					if (cuoc.le > 0) {
						if (!gameChan) {
							TienThang += cuoc.le;
							TongThang += cuoc.le*2;
						}else{
							TongThua  += cuoc.le;
						}
					}
					// 3 đỏ
					if (cuoc.red3 > 0) {
						if (red3) {
							TienThang += cuoc.red3;
							TongThang += cuoc.red3*4;
						}else{
							TongThua  += cuoc.red3;
						}
					}
					// 4 đỏ
					if (cuoc.red4 > 0) {
						if (red4) {
							TienThang += cuoc.red4;
							TongThang += cuoc.red4*11;
						}else{
							TongThua  += cuoc.red4;
						}
					}
					// 3 trắng
					if (cuoc.white3 > 0) {
						if (white3) {
							TienThang += cuoc.white3;
							TongThang += cuoc.white3*4;
						}else{
							TongThua  += cuoc.white3;
						}
					}
					// 4 trắng
					if (cuoc.white4 > 0) {
						if (white4) {
							TienThang += cuoc.white4;
							TongThang += cuoc.white4*11;
						}else{
							TongThua  += cuoc.white4;
						}
					}

					let update     = {};
					let updateGame = {};

					cuoc.thanhtoan = true;
					cuoc.betwin    = TongThang;
					cuoc.save();

					if (cuoc.red) {
						//RED
						if (TongThang > 0) {
							update['red'] = TongThang;
						}
						if (TienThang > 0) {
							update['redWin'] = updateGame['red'] = TienThang;
						}
						if (TongThua > 0) {
							update['redLost'] = updateGame['red_lost'] = TongThua;
						}

						update['redPlay'] = updateGame['redPlay'] = tongDat;

						UserInfo.updateOne({id:cuoc.uid}, {$inc:update}).exec();
						XocXoc_user.updateOne({uid:cuoc.uid}, {$inc:updateGame}).exec();
					}else{
						//XU
						if (TongThang > 0) {
							update['xu'] = TongThang;
						}
						if (TienThang > 0) {
							thuong = (TienThang*0.039589)>>0;
							update['xuWin'] = updateGame['xu'] = TienThang;
							update['red']   = update['thuong'] = updateGame['thuong'] = thuong;
						}
						if (TongThua > 0) {
							update['xuLost'] = updateGame['xu_lost'] = TongThua;
						}

						update['xuPlay'] = updateGame['xuPlay'] = tongDat;

						UserInfo.updateOne({id:cuoc.uid}, {$inc:update}).exec();
						XocXoc_user.updateOne({uid:cuoc.uid}, {$inc:updateGame}).exec();
					}
					if(void 0 !== self.clients[cuoc.uid]){
						let status = {};
						if (TongThang > 0) {
							status = {xocxoc:{status:{win:true, bet:TongThang, thuong:thuong}}};
						}else{
							status = {xocxoc:{status:{win:false, bet:TongThua}}};
						}
						self.clients[cuoc.uid].red(status);
						status = null;
					}

					TongThua   = null;
					TongThang  = null;
					thuong     = null;

					tongDat    = null;
					update     = null;
					updateGame = null;
					return {users:cuoc.name, bet:TienThang, red:cuoc.red};
				}))
				.then(function(arrayOfResults) {
					phien = null;
					dice = null;
					red3   = null;
					red4   = null;
					white3 = null;
					white4 = null;
					arrayOfResults = arrayOfResults.filter(function(st){
						return (st.red && st.bet > 0);
					});
					self.play();
					if (arrayOfResults.length) {
						arrayOfResults.sort(function(a, b){
							return b.bet-a.bet;
						});

						arrayOfResults = arrayOfResults.slice(0, 10);
						arrayOfResults = Helpers.shuffle(arrayOfResults);

						Promise.all(arrayOfResults.map(function(obj){
							return {users:obj.users, bet:obj.bet, game:'Xóc Xóc'};
						}))
						.then(results => {
							self.io.sendInHome({news:{a:results}});
							results = null;
							arrayOfResults = null;
							self = null;
						});
					}else{
						self = null;
					}
				});
			}else{
				phien = null;
				dice = null;
				red3   = null;
				red4   = null;
				white3 = null;
				white4 = null;

				self.play();
				self = null;
			}
		});
	}else{
		Object.values(this.clients).forEach(function(client){
			client.red({xocxoc:{client:self.data}});
		});

		///**
		let admin_data = {xocxoc:{info:this.dataAdmin, ingame:this.ingame}};
		Object.values(this.io.admins).forEach(function(admin){
			admin.forEach(function(client){
				if (client.gameEvent !== void 0 && client.gameEvent.viewXocXoc !== void 0 && client.gameEvent.viewXocXoc){
					client.red(admin_data);
				}
			});
		});
		//*/
		self = null;
	}
}

XocXoc.prototype.resetData = function(){
	this.data.red.chan =   0;
	this.data.red.le =     0;
	this.data.red.red3 =   0;
	this.data.red.red4 =   0;
	this.data.red.white3 = 0;
	this.data.red.white4 = 0;

	this.data.xu.chan =   0;
	this.data.xu.le =     0;
	this.data.xu.red3 =   0;
	this.data.xu.red4 =   0;
	this.data.xu.white3 = 0;
	this.data.xu.white4 = 0;

	this.chip.chan['1000']    = 0;
	this.chip.chan['10000']   = 0;
	this.chip.chan['50000']   = 0;
	this.chip.chan['100000']  = 0;
	this.chip.chan['1000000'] = 0;

	this.chip.le['1000']    = 0;
	this.chip.le['10000']   = 0;
	this.chip.le['50000']   = 0;
	this.chip.le['100000']  = 0;
	this.chip.le['1000000'] = 0;

	this.chip.red3['1000']    = 0;
	this.chip.red3['10000']   = 0;
	this.chip.red3['50000']   = 0;
	this.chip.red3['100000']  = 0;
	this.chip.red3['1000000'] = 0;

	this.chip.red4['1000']    = 0;
	this.chip.red4['10000']   = 0;
	this.chip.red4['50000']   = 0;
	this.chip.red4['100000']  = 0;
	this.chip.red4['1000000'] = 0;

	this.chip.white3['1000']    = 0;
	this.chip.white3['10000']   = 0;
	this.chip.white3['50000']   = 0;
	this.chip.white3['100000']  = 0;
	this.chip.white3['1000000'] = 0;

	this.chip.white4['1000']    = 0;
	this.chip.white4['10000']   = 0;
	this.chip.white4['50000']   = 0;
	this.chip.white4['100000']  = 0;
	this.chip.white4['1000000'] = 0;
};

XocXoc.prototype.resetDataAdmin = function(){
	this.ingame.red = {};
	this.ingame.xu  = {};

	this.dataAdmin.red.chan =   0;
	this.dataAdmin.red.le =     0;
	this.dataAdmin.red.red3 =   0;
	this.dataAdmin.red.red4 =   0;
	this.dataAdmin.red.white3 = 0;
	this.dataAdmin.red.white4 = 0;

	this.dataAdmin.xu.chan =   0;
	this.dataAdmin.xu.le =     0;
	this.dataAdmin.xu.red3 =   0;
	this.dataAdmin.xu.red4 =   0;
	this.dataAdmin.xu.white3 = 0;
	this.dataAdmin.xu.white4 = 0;
};

XocXoc.prototype.bot = function(users){
}

XocXoc.prototype.updateUsers = function(){
}

module.exports = XocXoc;
