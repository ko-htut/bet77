
var fs   = require('fs');

module.exports = function(client) {
	var promises = ['./config/sys.json', './config/taixiu.json', './config/baucua.json'].map(function(_path){
		return new Promise(function(_path, resolve, reject){
			fs.readFile(_path, 'utf8', function(err, data){
				if(err){
				   resolve("");
				}else{
				   resolve(data);
				}
			});
		}.bind(this, _path));
	});

	Promise.all(promises).then(function(results){
		try{
			let sys   = JSON.parse(results[0]);
			let txbot = JSON.parse(results[1]);
			let bcbot = JSON.parse(results[2]);
			let data = {txbot:txbot.bot, bcbot:bcbot.bot};
			data = Object.assign(data, sys);
			client.red({sys:data});
		} catch (error) {
		}
	});
}
