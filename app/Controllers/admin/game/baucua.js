
const BauCua_setDice = require('./baucua/set_dice');
const BauCua_getNew  = require('./baucua/get_new');

module.exports = function(client, data) {
	if (void 0 !== data.view) {
		client.gameEvent.viewBauCua = !!data.view
	}
	if (void 0 !== data.get_new) {
		BauCua_getNew(client);
	}
	if (void 0 !== data.set_dice) {
		BauCua_setDice(client, data.set_dice);
	}
}
