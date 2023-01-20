
var path     = require('path');
var fs       = require('fs');

module.exports = function(client, data) {
	var file = require('../../../../../config/bigbabol.json');

	file['100'].toX    = data.huD100>>0;
	file['100'].balans = data.huP100>>0;
	file['100'].x      = data.huX100>>0;

	file['1000'].toX    = data.huD1000>>0;
	file['1000'].balans = data.huP1000>>0;
	file['1000'].x      = data.huX1000>>0;

	file['10000'].toX    = data.huD10000>>0;
	file['10000'].balans = data.huP10000>>0;
	file['10000'].x      = data.huX10000>>0;

	file['0'] = !!data['0'];
	file['1'] = !!data['1'];
	file['2'] = !!data['2'];
	file['3'] = !!data['3'];
	file['4'] = !!data['4'];
	file['5'] = !!data['5'];
	file['6'] = !!data['6'];

	fs.writeFile(path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(__dirname))))) + '/config/bigbabol.json', JSON.stringify(file), function(err){
		if (!!err) {
			client.red({notice:{title:'THẤT BẠI', text:'Lưu thất bại...'}});
		}else{
			client.red({notice:{title:'THÀNH CÔNG', text:'Lưu thành công...'}});
		}
	});
}
