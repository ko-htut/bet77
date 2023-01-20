
let mb = require('./xs/mb');

module.exports = function(client, data) {
	if (!!data.mb) {
		mb(client, data.mb);
	}
}
