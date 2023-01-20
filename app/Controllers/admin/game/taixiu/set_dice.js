
//const TaiXiu = require('./game/taixiu.js')
var path     = require('path');
var fs       = require('fs');
var fileName = '../../../../../data/taixiu.json';

module.exports = function(client, data) {
	if (!!data) {
		var file = require(fileName);
			file.dice1  = data.dice1;
			file.dice2  = data.dice2;
			file.dice3  = data.dice3;
			file.uid    = client.UID;
			file.rights = client.rights;
			fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/data/taixiu.json', JSON.stringify(file), function(err){
				if (!!err) {
					client.red({notice:{title:'THẤT BẠI', text:'Đặt kết quả thất bại...'}});
				}else{
					client.red({notice:{title:'THÀNH CÔNG', text:'Đặt kết quả thành công...'}});
				}
			});
	}
}
