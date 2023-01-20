
let validator = require('validator');
let User      = require('./app/Models/Users');
let helpers   = require('./app/Helpers/Helpers');
let socket    = require('./app/socket.js');
let captcha   = require('./captcha');
let forgotpass = require('./app/Controllers/user/for_got_pass');

// Authenticate!
let authenticate = function(client, data, callback) {
	if (!!data && !!data.username && !!data.password) {
		let username = ''+data.username+'';
		let password = data.password;
		let register = !!data.register;
		let az09     = new RegExp('^[a-zA-Z0-9]+$');
		let testName = az09.test(username);

		if (!validator.isLength(username, {min: 3, max: 32})) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Tài khoản (3-32 kí tự).'}, false);
		}else if (!validator.isLength(password, {min: 6, max: 32})) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Mật khẩu (6-32 kí tự)'}, false);
		}else if (!testName) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Tên đăng nhập chỉ gồm kí tự và số !!'}, false);
		}else if (username == password) {
			register && client.c_captcha('signUp');
			callback({title: register ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP', text: 'Tài khoản không được trùng với mật khẩu!!'}, false);
		}else{
			try {
				username = username.toLowerCase();
				// Đăng Ký
				if (register) {
					if (!data.captcha || !client.c_captcha || !validator.isLength(data.captcha, {min: 4, max: 4})) {
						client.c_captcha('signUp');
						callback({title: 'ĐĂNG KÝ', text: 'Captcha không tồn tại.'}, false);	
					}else{
						let checkCaptcha = new RegExp('^' + client.captcha + '$', 'i');
						checkCaptcha     = checkCaptcha.test(data.captcha);
						if (checkCaptcha) {
							User.findOne({'local.username':username}).exec(function(err, check){
								if (!!check){
									client.c_captcha('signUp');
									callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
								}else{
									User.create({'local.username':username, 'local.password':helpers.generateHash(password), 'local.regDate': new Date()}, function(err, user){
										if (!!user){
											client.UID = user._id.toString();
											callback(false, true);
										}else{
											client.c_captcha('signUp');
											callback({title: 'ĐĂNG KÝ', text: 'Tên tài khoản đã tồn tại !!'}, false);
										}
									});
								}
							});
						}else{
							client.c_captcha('signUp');
							callback({title: 'ĐĂNG KÝ', text: 'Captcha không đúng.'}, false);
						}
					}
				} else {
					// Đăng Nhập
					User.findOne({'local.username':username}, function(err, user){
						if (user){
							if (user.validPassword(password)){
								client.UID = user._id.toString();
								callback(false, true);
							}else{
								callback({title: 'ĐĂNG NHẬP', text: 'Sai mật khẩu!!'}, false);
							}
						}else{
							callback({title: 'ĐĂNG NHẬP', text: 'Tài khoản không tồn tại!!'}, false);
						}
					});
				}
			} catch (error) {
				callback({title: 'THÔNG BÁO', text: 'Có lỗi sảy ra, vui lòng kiểm tra lại!!'}, false);
			}
		}
	}
};

module.exports = function(ws, redT){
	ws.auth      = false;
	ws.UID       = null;
	ws.captcha   = {};
	ws.c_captcha = captcha;
	ws.red = function(data){
		try {
			this.readyState == 1 && this.send(JSON.stringify(data));
		} catch(err) {}
	}
	socket.signMethod(ws);
	ws.on('message', function(message) {
		try {
			if (!!message) {
				message = JSON.parse(message);
				//console.log(message);
				if (!!message.captcha) {
					this.c_captcha(message.captcha);
				}
				if (!!message.forgotpass) {
					forgotpass(this, message.forgotpass);
				}
				if (this.auth == false && !!message.authentication) {
					authenticate(this, message.authentication, function(err, success){
						if (success) {
							this.auth = true;
							this.redT = redT;
							socket.auth(this);
						} else if (!!err) {
							this.red({unauth: err});
							//this.close();
						} else {
							this.red({unauth: {message: 'Authentication failure'}});
							//this.close();
						}
					}.bind(this));
				}else if(!!this.auth){
					socket.message(this, message);
				}
			}
		} catch (error) {
		}
	});
	ws.on('close', function(message) {
		if (this.UID !== null && void 0 !== this.redT.users[this.UID]) {
			if (this.redT.users[this.UID].length === 1 && this.redT.users[this.UID][0] === this) {
				delete this.redT.users[this.UID];
			}else{
				var self = this;
				this.redT.users[this.UID].forEach(function(obj, index){
					if (obj === self) {
						self.redT.users[self.UID].splice(index, 1);
					}
				});
			}
		}
		this.auth = false;
		void 0 !== this.TTClear && this.TTClear();
	});
}
