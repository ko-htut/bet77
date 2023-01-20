
let xsmb = require('../../../../../Models/XoSo/mb/xsmb');

module.exports = function(client, data) {
	if (!!data.date && !!data.giai1 &&
		Array.isArray(data.giai2) && data.giai2.length === 2 &&
		Array.isArray(data.giai3) && data.giai3.length === 6 &&
		Array.isArray(data.giai4) && data.giai4.length === 4 &&
		Array.isArray(data.giai5) && data.giai5.length === 6 &&
		Array.isArray(data.giai6) && data.giai6.length === 3 &&
		Array.isArray(data.giai7) && data.giai7.length === 4
		)
	{
		xsmb.findOne({date:data.date}, {}, function(err, result) {
			if (!!result) {
				result.gdb = data.giaidb;
				result.g1  = data.giai1;
				result.g2  = data.giai2;
				result.g3  = data.giai3;
				result.g4  = data.giai4;
				result.g5  = data.giai5;
				result.g6  = data.giai6;
				result.g7  = data.giai7;
				result.save();
			}else{
				xsmb.create({date:data.date, gdb:data.giaidb, g1:data.giai1, g2:data.giai2, g3:data.giai3, g4:data.giai4, g5:data.giai5, g6:data.giai6, g7:data.giai7});
			}
			client.red({xs:{mb:{kq:{notice:'Lưu thành công...'}}}});
		});
	}
}
