
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:           {type: String, required: true, unique: true},    // ID Người chơi

	tRedPlay:      {type: mongoose.Schema.Types.Long,  default: 0}, // Red Tài Xỉu đã chơi

	tWinRed:       {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng red thắng
	tLostRed:      {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng red thua

	tLineWinRed:   {type: Number,  default: 0},                     // Dây thắng Red
	tLineLostRed:  {type: Number,  default: 0},                     // Dây thua Red
	first:         {type: Number,  default: 0},                     // Red - TX - Phiên đầu tiên
	last:          {type: Number,  default: 0},                     // Red - TX - Phiên cuối cùng

	tLineWinRedH:  {type: Number,  default: 0},                     // Dây thắng Red hiện tại
	tLineLostRedH: {type: Number,  default: 0},                     // Dây thua Red hiện tại

	tXuPlay:       {type: mongoose.Schema.Types.Long,  default: 0}, // Xu Tài Xỉu đã chơi

	tWinXu:        {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng xu thắng
	tLostXu:       {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng xu thua

	tLineWinXu:    {type: Number,  default: 0},                     // Dây thắng xu
	tLineLostXu:   {type: Number,  default: 0},                     // Dây thua xu

	tLineWinXuH:   {type: Number,  default: 0},                     // Dây thắng xu hiện tại
	tLineLostXuH:  {type: Number,  default: 0},                     // Dây thua xu hiện tại

	cRedPlay:      {type: mongoose.Schema.Types.Long,  default: 0}, // Red chẵn lẻ đã chơi

	cWinRed:       {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng red thắng
	cLostRed:      {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng red thua

	cLineWinRed:   {type: Number,  default: 0},                     // Dây thắng Red
	cLineLostRed:  {type: Number,  default: 0},                     // Dây thua Red

	cLineWinRedH:  {type: Number,  default: 0},                     // Dây thắng Red hiện tại
	cLineLostRedH: {type: Number,  default: 0},                     // Dây thua Red hiện tại

	cXuPlay:       {type: mongoose.Schema.Types.Long,  default: 0}, // Xu chẵn lẻ đã chơi

	cWinXu:        {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng xu thắng
	cLostXu:       {type: mongoose.Schema.Types.Long,  default: 0}, // Tổng xu thua

	cLineWinXu:    {type: Number,  default: 0},                     // Dây thắng xu
	cLineLostXu:   {type: Number,  default: 0},                     // Dây thua xu

	cLineWinXuH:   {type: Number,  default: 0},                     // Dây thắng xu hiện tại
	cLineLostXuH:  {type: Number,  default: 0},                     // Dây thua xu hiện tại
});

module.exports = mongoose.model('TaiXiu_user', Schema);
