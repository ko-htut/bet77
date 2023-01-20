
let Poker = function(){
	this.room = {};
}

Poker.prototype.addRoom = function(id, room){
	this.room[id] = room;
	return this.room;
}

Poker.prototype.removeRoom = function(id){
	delete this.room[id];
}

module.exports = Poker;
