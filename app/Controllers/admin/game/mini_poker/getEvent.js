
module.exports = function(client) {
	var data = require('../../../../../config/minipoker.json');
	client.red({mini_poker:{eventData:data}});
}
