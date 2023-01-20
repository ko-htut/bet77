
var Bank_history = require('../../../../Models/Bank/Bank_history');
var nap = require('./nap');

module.exports = function (client, id) {
	Bank_history.deleteOne({'_id':id}, function(err, bank){
		if (bank.n > 0) {
			nap(client, {page:1});
			client.red({banklist:{remove:true}, notice:{title:'THÀNH CÔNG',text:'XÓA thành công...'}});
		}else{
			client.red({banklist:{remove:true}, notice:{title:'THẤT BẠI',text:'Không tồn tại...'}});
		}
	});
}