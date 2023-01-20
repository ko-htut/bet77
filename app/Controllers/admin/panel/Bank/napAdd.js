
var Bank_history = require('../../../../Models/Bank/Bank_history');
var UserInfo     = require('../../../../Models/UserInfo');

var nap          = require('./nap');

module.exports = function (client, data) {
	if (data.uid && data.bank && data.money && data.info && data.status) {
		var status = data.status>>0;
		var money  = data.money>>0;
		UserInfo.findOne({'UID':data.uid}, 'id red', function(err, user){
			if (user) {
				if (status === 1) {
					user.red = user.red*1+money;
					user.save();
				}
				client.red({banklist:{remove:true}, notice:{title:'THÀNH CÔNG',text:'Hóa đơn thêm thành công.'}});
				Bank_history.create({uid:user.id, bank:data.bank, money:money, info:data.info, status:1, time: new Date()}, function(){
					nap(client, {page:1});
				});
			}else{
				client.red({banklist:{remove:true}, notice:{title:'LỖI',text:'Người dùng không tồn tại.'}});
			}
		});
	}
}
