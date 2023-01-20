
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String,  required: true}, // ID người dùng
	phone:  {type: String,  required: true}, // Số điện thoại
	code:   {type: String,  required: true}, // Mã OTP
	active: {type: Boolean, default: false}, // Trạng thái sử dụng
    date:   {type: Date,    required: true}, // Thời gian tạo
});

Schema.index({uid: 1, phone: 1}, {background: true});

module.exports = mongoose.model('OTP', Schema);
