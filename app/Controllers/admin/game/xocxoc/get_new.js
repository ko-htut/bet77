
let fs = require('fs');

module.exports = function(client) {
	fs.readFile('./data/xocxoc.json', 'utf8', (errcf, txtJson) => {
		try {
			txtJson = JSON.parse(txtJson);
			client.red({xocxoc:{dices:[txtJson.red1, txtJson.red2, txtJson.red3, txtJson.red4], time_remain: client.redT.game.xocxoc.time, ingame: client.redT.game.xocxoc.ingame, info: client.redT.game.xocxoc.dataAdmin}});
		} catch (error) {
			client.red({notice:{title:'THẤT BẠI', text:'Lỗi bất ngờ...'}});
		}
	});
}
