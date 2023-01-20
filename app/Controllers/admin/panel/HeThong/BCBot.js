
var path     = require('path');
var fs       = require('fs');

module.exports = function(client, data) {
	var file = require('../../../../../config/baucua.json');
	var TT   = null;
	if (data == '0') {
		TT = file.bot = false;
	}else if (data == '1') {
		TT = file.bot = true;
	}
	if (TT != null) {	
		fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/config/baucua.json', JSON.stringify(file), function(err){
			if (!!err) {
				client.red({notice:{title:'THẤT BẠI', text:'đổi chế độ thất bại...'}});
			}
		});
	}
}
