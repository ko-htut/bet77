
let mongoose = require('mongoose');
let bcrypt   = require('bcrypt');

let Schema = new mongoose.Schema({
	local: {
		username:   { type: String,  required: true, unique: true},
		password:   { type: String,  required: true, hide: true },
		ban_pass:   { type: Number,  default: 0 },
		ban_login:  { type: Boolean, default: false },
		token:      String,
		lastDate:   String,
		lastLogin:  String,
		regDate:    Date,
	},
	facebook: {
		id:         String,
		token:      String,
		email:      String,
		name:       String,
		regDate:    Date,
	},
	twitter: {
		id:          String,
		token:       String,
		email:       String,
		name:        String,
		regDate:     Date,
	},
	google: {
		id:         String,
		token:      String,
		email:      String,
		name:       String,
		regDate:    Date,
	},
});

// Các phương thức ======================
// Tạo mã hóa mật khẩu
Schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

// kiểm tra mật khẩu có trùng khớp
Schema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// Tài khoản bị khóa
Schema.methods.isBan = function() {
	return this.local.ban_login;
};

// Kiểm tra khóa lấy lại mật khẩu
Schema.methods.forGotPass = function() {
	return this.local.ban_pass;
};

module.exports = mongoose.model('Users', Schema);
