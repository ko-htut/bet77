
var MuaThe      = require('../../../../../Models/MuaThe');
var MuaThe_card = require('../../../../../Models/MuaThe_card');

module.exports = function (client, data) {
	MuaThe.deleteOne({'_id':data}).exec();
	MuaThe_card.deleteMany({'cart':data}).exec();
	client.red({banklist:{remove:true}, mua_the:{remove:true}, notice:{title:'THÀNH CÔNG', text:'XÓA thành công...'}});
}
