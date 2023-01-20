
let XocXoc_setDice = require('./xocxoc/set_dice');
let XocXoc_getNew  = require('./xocxoc/get_new');

module.exports = function(client, data) {
	if (void 0 !== data.view) {
		client.gameEvent.viewXocXoc = !!data.view;
	}
	if (void 0 !== data.get_new) {
		XocXoc_getNew(client);
	}
	if (void 0 !== data.set_dice) {
		XocXoc_setDice(client, data.set_dice);
	}
}
