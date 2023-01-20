let xsmb = require('../../../../Models/XoSo/mb/xsmb');

module.exports = function(client, date){
	xsmb.findOne({date:date}, 'g1 g2 g3 g4 g5 g6 g7 gdb', function(err, data){
		if (!!data) {
			data = data._doc;
			delete data._id;
			client.red({XoSo:{kq:{mb:data}}});
		}
	});
}
