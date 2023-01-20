
let mb  = require('./XoSo/mb');

module.exports = function(client, data){
	if (!!data.mb) {
		mb(client, data.mb);
	}
	client = null;
	data   = null;
};
