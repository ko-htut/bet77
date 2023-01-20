
var fs = require('fs');

module.exports = function(data) {
	fs.readFile('./config/sys.json', 'utf8', (err, dataF)=>{
		try {
			var sys = JSON.parse(dataF);
			sys.fanpage = data;
			fs.writeFile('./config/sys.json', JSON.stringify(sys), function(err){
				if (!!err) {
					client.red({notice:{title:'THẤT BẠI', text:'Đổi Fanpage thất bại...'}});
				}
			});
		} catch (error) {
		}
	});
}
