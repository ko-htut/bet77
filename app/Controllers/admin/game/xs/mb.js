
let history   = require('./mb/history');
let getdate   = require('./mb/getdate');
let update    = require('./mb/update');
let trathuong = require('./mb/trathuong');

module.exports = function(client, data) {
	if (!!data.history) {
		history(client, data.history);
	}
	if (!!data.getdate) {
		getdate(client, data.getdate);
	}
	if (!!data.update) {
		update(client, data.update);
	}
	if (!!data.trathuong) {
		trathuong(client, data.trathuong);
	}
}
