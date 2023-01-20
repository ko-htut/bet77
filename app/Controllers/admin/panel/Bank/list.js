
var Bank = require('../../../../Models/Bank/Bank');

module.exports = function (client, notice = false) {
	Bank.find({}, {}, function(err, data){
		if (notice) {
			client.red({banklist:{data:data},notice:{title:notice.title,text:notice.text}});
		}else{
			client.red({banklist:{data:data}});
		}
	});
}
