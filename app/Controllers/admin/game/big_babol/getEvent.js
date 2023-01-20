
module.exports = function(client) {
	var data = require('../../../../../config/bigbabol.json');
	client.red({big_babol:{eventData:data}});
}
