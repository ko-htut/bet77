
var UserInfo = require('../../../../Models/UserInfo');

var Player = function(client, room, balans, red, auto){
	this.room     = null; // Phòng game
	this.map      = null; // vị trí ghế ngồi

	this.isInGame = false; // người chơi đang trong game
	this.isPlay   = false; // người chơi đang chơi
	this.isOut    = false; // người chơi đã thoát

	this.uid   = client.UID;          // id người chơi
	this.name  = client.profile.name; // tên người chơi

	this.client   = client; // địa chỉ socket của người chơi
	this.game     = room;   // game (100/1000/5000/10000/...)
	this.balans   = balans; // sô tiền mang vào
	this.red      = red;    // Loại tiền (red: true)
	this.autoNap  = auto;   // Tự động nạp tiền mang vào
}

Player.prototype.addRoom = function(room){
	this.room = room;
	return this.room;
}

Player.prototype.outGame = function(){
	// Thoát game sẽ trả lại tiền vào tài khoản và thoát game

	this.isOut = true;
	this.client.poker = null;
	this.client = null;

	if (!!this.room) {
		this.room.outroom(this);
	}

	if (this.balans > 0) {
		var uInfo = {};
		if (this.red) {
			uInfo.red = this.balans;
		}else{
			uInfo.xu  = this.balans;
		}
		UserInfo.updateOne({id: this.uid}, {$inc:uInfo}).exec();
	}
}


module.exports = Player;
