
var get_data = require('./big_babol/get_data');
var get_top  = require('./big_babol/get_top');
var name_hu  = require('./big_babol/name_hu');

var getEvent = require('./big_babol/getEvent');
var setEvent = require('./big_babol/setEvent');

var setChedo = require('./big_babol/setChedo');


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

	if (!!data.getEvent) {
		getEvent(client)
	}
	if (!!data.setEvent) {
		setEvent(client, data.setEvent)
	}
	if (void 0 !== data.chedo) {
		setChedo(client, data.chedo);
	}
}
