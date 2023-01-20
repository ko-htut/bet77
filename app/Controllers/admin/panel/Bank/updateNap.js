
let Bank_history = require('../../../../Models/Bank/Bank_history');
let UserInfo     = require('../../../../Models/UserInfo');

module.exports = function (client, data) {
	if (!!data.id && !!data.status) {
		let status = data.status>>0;
		Bank_history.findOne({'_id':data.id}, {}, function(err, history){
			if (!!history) {
				if (history.status !== status) {
					let update = {};
					if (status === 1) {
						update.red = history.money;  // Thành công
					}else if(history.status === 1){
						update.red = -history.money; // Thất bại
					}
					UserInfo.updateOne({'id':history.uid}, {$inc:update}).exec();
				}

				history.status = status;
				history.save();
			}else{
				client.red({notice:{title:'LỖI',text:'Phiên không được tìm thấy.'}});
			}
		});
	}
}
