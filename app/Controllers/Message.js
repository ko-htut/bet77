
var update = require('./message/update');
var view   = require('./message/view');

module.exports = function(client, data){
	if (!!data.update) {
		update(client);
	}
	if (!!data.view) {
		view(client, data.view);
	}
}
