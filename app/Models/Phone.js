
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, required: true, unique: true}, // ID người dùng
	phone:  {type: String, required: true, unique: true}, // Số điện thoại
	region: {type: String, required: true},               // Mã quốc gia
});

module.exports = mongoose.model('Phone', Schema);
