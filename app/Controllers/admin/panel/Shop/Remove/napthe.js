
var NapThe = require('../../../../../Models/NapThe');

module.exports = function (client, data) {
	NapThe.deleteOne({'_id':data}).exec();
	client.red({banklist:{remove:true}, nap_the:{remove:true}, notice:{title:'THÀNH CÔNG', text:'XÓA thành công...'}});
}
