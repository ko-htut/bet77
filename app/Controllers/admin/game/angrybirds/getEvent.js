
module.exports = function(client) {
	var data = require('../../../../../config/angrybird.json');
	client.red({angrybird:{eventData:data}});
}
