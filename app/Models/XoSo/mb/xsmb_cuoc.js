
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	name:      {type: String, required:true, index:true},      // ID người chơi
	date:      {type: String, required:true, index:true},      // cược Ngày
	type:      {type: String},                                 // Loại cược
	so:        {type: Array},                                  // Số chọn
	diem:      {type: Number, default: 0},                     // Số điểm
	thanhtoan: {type: Boolean, default: false},                // Trạng thái thanh toán (false: chưa, true: đã trả)
	cuoc:      {type: mongoose.Schema.Types.Long, default: 0}, // Tổng cược
	win:       {type: mongoose.Schema.Types.Long, default: 0}, // Tổng Thắng
	time:      {type: Date},                                   // thời gian
});

//Schema.index({name:1, date:1}, {background: true});

module.exports = mongoose.model('xsmb_cuoc', Schema);
