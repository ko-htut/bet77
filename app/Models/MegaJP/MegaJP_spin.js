
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	name: {type: String, required: true, index: true}, // Tên người chơi
	room: {type: Number, default: 0},                  // Phòng 100/1000/10000

	kq:   {type: Number, default: 0},                  // Kết quả
	win:  {type: Number, default: 0},                  // Tiền thắng

	time: {type: Date,   default: new Date()},
});

module.exports = mongoose.model('MegaJP_spin', Schema);
