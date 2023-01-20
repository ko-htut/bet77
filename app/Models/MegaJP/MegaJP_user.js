
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, unique: true}, // ID Người chơi

	hu:     {type: Number, default: 0},                   // Số lần Nổ Hũ
	spin:   {type: Number, default: 0},                   // Số lần đã quay
	win:    {type: Number, default: 0},                   // Số tiền đã thắng

	win100:  {type: Number, default: 0},                  // Thắng 100
	lost100: {type: Number, default: 0},                  // Thua 100
	last100: {type: Number, default: 0},                  // 100 update

	win1000:  {type: Number, default: 0},                 // Thắng 1000
	lost1000: {type: Number, default: 0},                 // Thua 1000
	last1000: {type: Number, default: 0},                 // 1000 update

	win10000:  {type: Number, default: 0},                // Thắng 10000
	lost10000: {type: Number, default: 0},                // Thua 10000
	last10000: {type: Number, default: 0},                // 10000 update

	100:    {type: Number, default: 0},                   // Lượt quay phòng 100
	1000:   {type: Number, default: 0},                   // Lượt quay phòng 1000
	10000:  {type: Number, default: 0},                   // Lượt quay phòng 10000
});

module.exports = mongoose.model('MegaJP_user', Schema);
