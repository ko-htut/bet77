
var Bank = require('../../../../Models/Bank/Bank');
var list = require('./list');

module.exports = function (client, data) {
	if (!!data.bank && !!data.number && !!data.name && !!data.branch) {
		Bank.create({bank:data.bank, number:data.number, name:data.name, branch:data.branch}, function(err, bank){
			if (!!bank) {
				list(client, {title:'THÀNH CÔNG',text:'Thêm ngân hàng thành công.'});
			}else{
				client.red({notice:{title:'THẤT BẠI',text:'Số tài khoản đã tồn tại'}});
			}
		});
	}else{
		client.red({notice:{title:'THẤT BẠI',text:'Không bỏ trống các thông tin...'}});
	}
}
