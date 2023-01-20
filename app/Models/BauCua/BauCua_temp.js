
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	0: {type: Number,  default: 0}, // Số lần về Hươu
	1: {type: Number,  default: 0}, // Số lần về Bầu
	2: {type: Number,  default: 0}, // Số lần về Gà
	3: {type: Number,  default: 0}, // Số lần về Cá
	4: {type: Number,  default: 0}, // Số lần về Cua
	5: {type: Number,  default: 0}, // Số lần về Tôm

	huRed: {type: Number,  default: 0}, // Hũ RED
	huXu:  {type: Number,  default: 0}, // Hũ Xu
	minHuRed: {type: Number,  default: 0}, // Hũ RED
	minHuXu:  {type: Number,  default: 0}, // Hũ Xu
});

module.exports = mongoose.model('BauCua_temp', Schema);
