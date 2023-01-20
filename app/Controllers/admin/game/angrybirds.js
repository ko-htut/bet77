
var get_data = require('./angrybirds/get_data');
var get_top  = require('./angrybirds/get_top');
var name_hu  = require('./angrybirds/name_hu');
var getEvent = require('./angrybirds/getEvent');
var setEvent = require('./angrybirds/setEvent');
var setChedo = require('./angrybirds/setChedo');

module.exports = function(client, data) {
	if (!!data.get_data) {
		get_data(client)
	}
	if (!!data.name_hu) {
		name_hu(client, data.name_hu)
	}
	if (!!data.get_top) {
		get_top(client, data.get_top)
	}
	if (!!data.getEvent) {
		getEvent(client);
	}
	if (!!data.setEvent) {
		setEvent(client, data.setEvent);
	}
	if (void 0 !== data.chedo) {
		setChedo(client, data.chedo);
	}
}
