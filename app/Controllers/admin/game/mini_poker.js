
var get_data = require('./mini_poker/get_data');
var get_top  = require('./mini_poker/get_top');
var name_hu  = require('./mini_poker/name_hu');

var getEvent = require('./mini_poker/getEvent');
var setEvent = require('./mini_poker/setEvent');

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
}
