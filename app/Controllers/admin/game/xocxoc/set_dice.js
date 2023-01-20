
let fs = require('fs');

module.exports = function(client, data) {
	fs.readFile('./data/xocxoc.json', 'utf8', (errcf, txtJson) => {
		try {
			txtJson = JSON.parse(txtJson);
			for (let [key, value] of Object.entries(data)) {
				key = (key>>0)+1;
				txtJson['red'+key] = value;
			}
			fs.writeFile('./data/xocxoc.json', JSON.stringify(txtJson), function(err){});
			client.redT.admins[client.UID].forEach(function(obj){
				obj.red({xocxoc:{dices:[txtJson.red1, txtJson.red2, txtJson.red3, txtJson.red4]}});
			});
		} catch (error) {
			client.red({notice:{title:'THẤT BẠI', text:'Đặt kết quả thất bại...'}});
		}
	});
}
