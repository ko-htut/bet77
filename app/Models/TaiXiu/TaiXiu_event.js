
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	date:   {type: String,  required: true}, // ngày sự kiện
	top:    {type: Number,  default: 0},     // Vị trí (Top)
	name:   {type: String,  required: true}, // Tên tài khoản
	line:   {type: Number,  required: true}, // Số dây Thắng/Thua
	win:    {type: Boolean, default: false}, // Thắng/Thua
	first:  {type: Number,  default: 0},     // Phiên đầu tiên
	last:   {type: Number,  default: 0},     // Phiên cuối cùng
	reward: {type: Number,  default: 0},     // Phần thưởng
});

Schema.index({date:1, win:1}, {background: true});

module.exports = mongoose.model('TaiXiu_event', Schema);
