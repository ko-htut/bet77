
var UserInfo  = require('../../../Models/UserInfo');

var Poker_red = require('../../../Models/Poker/Poker_red');
var Poker_xu  = require('../../../Models/Poker/Poker_xu');

var Helpers   = require('../../../Helpers/Helpers');
var Room      = require('./lib/room');

module.exports = function(client){
	var poker = client.poker;
	if (poker.red) {
		Poker_red.findOne({room: poker.game}, {}, {sort:{'online':1}}, function(err, room){
			if (!room || room.online >= 6) {
				// tạo phòng mới
				Poker_red.create({'room': poker.game}, function(create_err, create_data){
					var newRoom = new Room(client.redT.game.poker);
					newRoom.dataroom = create_data;
					client.redT.game.poker.addRoom(create_data._id, newRoom);
					// vào phòng chơi
					newRoom.inroom(poker);
				});
			}else{
				// vào phòng
				if (!!client.redT.game.poker.room[room._id]) {
					var getRoom = client.redT.game.poker.room[room._id];
					// vào phòng chơi
					getRoom.inroom(poker);
				}else{
					var newRoom = new Room(client.redT.game.poker);
					newRoom.dataroom = room;
					client.redT.game.poker.addRoom(room._id, newRoom);
					// vào phòng chơi
					newRoom.inroom(poker);
				}
			}
		});
	}else{
		Poker_xu.findOne({room: poker.game}, {}, {sort:{'online':1}}, function(err, room){
			if (!room || room.online == 6) {
				// tạo phòng mới
				Poker_xu.create({room: poker.game, online: 1}, function(create_err, create_data){
				});
			}else{
				// vào phòng
			}
		});
	}
}
