
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	date:    {type: String, required:true, unique:true},     // Ngày sổ
	gdb:     {type: String},                                 // Giải Đặc Biệt
	g1:      {type: String},                                 // Giải Nhất
	g2:      {type: Array},                                  // Giải Nhì
	g3:      {type: Array},                                  // Giải 3
	g4:      {type: Array},                                  // Giải 4
	g5:      {type: Array},                                  // Giải 5
	g6:      {type: Array},                                  // Giải 6
	g7:      {type: Array},                                  // Giải 7
	pay:     {type: Boolean, default: false},                // Trạng thái trả thưởng (false: chưa, true: đã trả)
	cuoc:    {type: mongoose.Schema.Types.Long, default: 0}, // Tổng cược
	tra:     {type: mongoose.Schema.Types.Long, default: 0}, // Tổng trả
});

module.exports = mongoose.model('xsmb', Schema);
