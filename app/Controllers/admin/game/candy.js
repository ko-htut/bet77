
var get_data = require('./candy/get_data');
var get_top  = require('./candy/get_top');
var name_hu  = require('./candy/name_hu');
var setChedo = require('./candy/setChedo');

module.exports = function(client, data) {
	if (void 0 !== data.get_data) {
		get_data(client)
	}
	if (void 0 !== data.name_hu) {
		name_hu(client, data.name_hu)
	}
	if (void 0 !== data.get_top) {
		get_top(client, data.get_top)
	}
	if (void 0 !== data.chedo) {
		setChedo(client, data.chedo);
	}
}
