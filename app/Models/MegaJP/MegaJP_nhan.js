
let mongoose = require('mongoose');

/**
sl
	* 100: Angrybird
	* 101: BigBabol
	* 102: Candy
	* 103: Longlan
	* 104: mini 3 cay
	* 105: VQRED
	* 106: Mini Poker
*/
let Schema = new mongoose.Schema({
	uid:    {type: String,  required: true, index: true}, // ID người chơi
	room:   {type: Number,  default: 0},                  // Phòng 100/1000/10000
	to:     {type: Number,  default: 0},                  // Nguồn
	sl:     {type: Number,  default: 0},                  // Số lượng
	status: {type: Boolean, default: false},              // Trạng thái nhận
	time:   {type: Date,    default: new Date()},
});

module.exports = mongoose.model('MegaJP_nhan', Schema);
