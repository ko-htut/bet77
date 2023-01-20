
var Helpers   = require('../../../../Helpers/Helpers');
var base_card = require('../../../../../data/card');

var Poker = function(poker){
	this.poker = poker; // quản lý các phòng
	this.card  = [];    // bài

	// ghế ngồi có sẵn 
	this.player = {
		1: {id:1,
			data:null},
		2: {id:2,
			data:null},
		3: {id:3,
			data:null},
		4: {id:4,
			data:null},
		5: {id:5,
			data:null},
		6: {id:6,
			data:null},
	};

	this.playerWait   = {}; // người chơi đang chờ phiên mới // chờ vào ván mới
	this.playerInGame = []; // người chơi trong ván chơi     // bỏ bài
	this.playerPlay   = []; // đang chơi                     // đang chơi

	this.isPlay       = false; // phòng đang chơi
	this.timeOut      = null;  // thời gian

	this.d            = null;  // Người chơi đầu tiên / lượt chơi
	this.round        = 0;
};

Poker.prototype.sendTo = function(client, data){
	client.red(data);
}

Poker.prototype.sendToAll = function(data, player = null){
	var trongPhong = Object.values(this.player); // danh sách ghế
	Promise.all(trongPhong.map(function(ghe){
		if (!!ghe.data && ghe.data !== player) {
			!!ghe.data.client && ghe.data.client.red(data);
		}
	}));
}

Poker.prototype.inroom = function(player){
	this.dataroom.online += 1;
	this.dataroom.save();

	player.room = this;

	var trongPhong = Object.values(this.player);                          // danh sách ghế
	var gheTrong = trongPhong.filter(function(t){return t.data == null}); // lấy các ghế trống

	// lấy ngẫu nhiên 1 ghế trống và ngồi
	var rand = (Math.random()*gheTrong.length)>>0;
	gheTrong = gheTrong[rand];

	this.player[gheTrong.id].data = player; // ngồi
	player.map = gheTrong.id;               // vị trí ngồi

	this.sendToAll({ingame:{ghe:player.map, data:{name:player.name, balans:player.balans}}}, player);

	trongPhong = Object.values(this.player); // danh sách ghế
	Promise.all(trongPhong.map(function(ghe){
		if (!!ghe.data) {
			return {ghe:ghe.id, data:{name:ghe.data.name, balans:ghe.data.balans}};
		}else{
			return {ghe:ghe.id, data:null};
		}
	}))
	.then(result => {
		var client = {infoGhe:result, infoRoom:{game:player.game, red:player.red, id: this.dataroom.id}, meMap:player.map};
		this.sendTo(player.client, client);
	});

	this.dataroom.online == 1 && (this.d = player);
	this.dataroom.online > 1 && this.checkGame();
}

Poker.prototype.outroom = function(player){
	this.dataroom.online -= 1;
	if (this.dataroom.online < 1) {
		var id = this.dataroom._id;
		this.poker.removeRoom(id);
		this.dataroom.remove();
	}else{
		this.dataroom.save();
	}

	this.player[player.map].data = null;
	this.sendToAll({outgame:player.map});

	if (this.dataroom.online == 1) {
		this.isPlay = false;
		if (!!this.timeOut) {
			clearTimeout(this.timeOut);
			this.timeOut = null;
		}
	}
	if (this.d == player) {
		this.resetD();
	}
}

Poker.prototype.checkGame = function(){
	if (!this.isPlay && !this.timeOut) {
		var self = this;
		this.timeOut = setTimeout(function(){
			var trongPhong = Object.values(this.player);                      // danh sách ghế
			var ghe = trongPhong.filter(function(t){return t.data !== null}); // ghế có người ngồi

			//this.isPlay  = true;
			this.playerWait = {}; // người được chơi trong phiên sắp tới

			Promise.all(ghe.map(function(player){
				self.playerWait[player.id] = {id:player.id, data:player.data};
				return {ghe:player.id, data:{progress:5}};
			}))
			.then(result => {
				this.sendToAll({game:{start:result}});
				this.timeOut = setTimeout(function(){
					this.playerInGame = Object.values(this.playerWait); // danh sách người chơi
					var self = this;
					// vị trí người chơi đầu tiên trong mảng,
					this.indexBegin = this.playerInGame.findIndex(function(obj){
						return obj.ghe == self.d.map;
					});
					this.Round1();
				}.bind(this), 5000);
			});
		}.bind(this), 1000);
	}
}

// Round 1 // Chia 2 lá đầu
Poker.prototype.Round1 = function(){
	this.card = [...base_card.card]; // bộ bài mới
	// chia bài
}

// Round 2 // mở 3 lá
Poker.prototype.Round2 = function(){
}

Poker.prototype.resetD = function(){
}

module.exports = Poker;
