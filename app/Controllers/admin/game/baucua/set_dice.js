
var path     = require('path');
var fs       = require('fs');
var fileName = '../../../../../data/baucua.json';

module.exports = function(client, data) {
	if (!!data) {
		var file = require(fileName);
		Object.assign(file, data);
		file.uid    = client.UID;
		file.rights = client.rights;
		fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/data/baucua.json', JSON.stringify(file), function(err){
			if (!!err) {
				client.red({notice:{title:'THẤT BẠI', text:'Đặt kết quả thất bại...'}});
			}else{
				Promise.all(client.redT.admins[client.UID].map(function(obj){
					obj.red({baucua:{dices:[file[0], file[1], file[2]]}});
				}));
			}
		});
	}
}
