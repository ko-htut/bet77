
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	name:     {type: String, required: true}, // Tên đại lý
	nickname: {type: String, required: true}, // Tên nhân vật trong game
	phone:    {type: String, required: true}, // Số điện thoại
	fb:       {type: String, default:  ''},   // ID Facabook
});

module.exports = mongoose.model('DaiLy', Schema);
