
var fs   = require('fs');
//var path = require('path');

module.exports = function(res) {
	//fs.readFile(path.dirname(path.dirname(__dirname)) + '/config/sys.json', 'utf8', (err, data)=>{
	fs.readFile('./config/sys.json', 'utf8', (err, data)=>{
		try {
			var sys = JSON.parse(data);
			return res.redirect(sys.fanpage);
		} catch (error) {
			return res.redirect('/');
		}
	});
}
