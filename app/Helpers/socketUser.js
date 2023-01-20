
//let Poker = require('./poker/init');

let XocXoc = require('../Controllers/game/XocXoc/init');

module.exports = function(io){
	io.users  = []; // danh sách người dùng đăng nhập
	io.admins = []; // danh sách admin đăng nhập
	/*
	io.game   = {
		poker: new Poker(), // thiết lập game poker
	};
	*/

	io.game   = {
		xocxoc: new XocXoc(io), // thiết lập game poker
	};

	// Phát sóng tới tất cả người dùng và khách
	io.broadcast = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && noBroadcast !== client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả  khách
	io.sendAllClient = function(data){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && client.auth === false) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả người dùng
	io.sendAllUser = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && client.auth === true && noBroadcast !== client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả người dùng
	io.sendAllAdmin = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (client.admin === true && client.auth === true && noBroadcast !== client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả khách
	io.sendInHome = function(data){
		io.clients.forEach(function(client){
			if (void 0 === client.admin && (client.auth === false || client.scene === 'home')) {
				client.red(data);
			}
		});
	};
};
