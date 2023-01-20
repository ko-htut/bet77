
var Bank = require('../../../../../Models/Bank/Bank_history');

module.exports = function (client, data) {
	Bank.deleteOne({'_id':data}).exec();
	client.red({banklist:{remove:true}, bankrut_remove:true, notice:{title:'THÀNH CÔNG', text:'XÓA thành công...'}});
}
