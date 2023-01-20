
let mongoose = require('mongoose');
let bcrypt  = require('bcrypt');

let Schema = new mongoose.Schema({
	username:   { type: String, required: true, unique: true},
	password:   { type: String, required: true, hide: true },
	rights:     { type: Number, default: 0},
	token:      String,
	lastLogin:  String,
	regDate:    Date,
});

// Các phương thức ======================
// Tạo mã hóa mật khẩu
Schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};
// kiểm tra mật khẩu có trùng khớp
Schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', Schema);
