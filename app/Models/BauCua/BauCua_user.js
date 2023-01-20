
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:      {type: String, required: true, unique: true}, // ID Người chơi
	red:      {type: Number,  default: 0},                  // Tổng red thắng
	red_lost: {type: Number,  default: 0},                  // Tổng red thua
	redPlay:  {type: Number,  default: 0},                  // Red đã chơi
	xu:       {type: Number,  default: 0},                  // Tổng xu thắng
	xu_lost:  {type: Number,  default: 0},                  // Tổng xu thua
	xuPlay:   {type: Number,  default: 0},                  // Xu đã chơi
	thuong:   {type: Number,  default: 0},                  // Thưởng Red khi chơi Xu
});
//Schema.index({uid: 1}, {unique: true, background: true});

module.exports = mongoose.model('BauCua_user', Schema);
