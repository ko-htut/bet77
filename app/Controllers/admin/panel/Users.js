
var get_users  = require('./user/get_users');
var get_info   = require('./user/get_info');
var updateUser = require('./user/updateUser');
var remove     = require('./user/remove');
var history    = require('./user/history');

module.exports = function (client, data) {
	if (void 0 !== data.get_info) {
		get_info(client, data.get_info)
	}
	if (void 0 !== data.get_users) {
		get_users(client, data.get_users);
	}
	if (void 0 !== data.update) {
		updateUser(client, data.update)
	}
	if (!!data.remove) {
		remove(client, data.remove)
	}
	if (!!data.history) {
		history(client, data.history)
	}
}
