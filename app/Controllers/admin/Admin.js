
var Admin     = require('../../Models/Admin');

var validator = require('validator');
var Helper    = require('../../Helpers/Helpers');

function first(client) {
	var data = {
		Authorized: true,
	};
	client.red(data);
}

function changePassword(client, data){
	if (!!data && !!data.password && !!data.newPassword && !!data.newPassword2) {
		if (!validator.isLength(data.password, {min: 6, max: 32})) {
			client.red({notice: {title:'LỖI', text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.newPassword, {min: 6, max: 32})) {
			client.red({notice: {title:'LỖI', text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		}else if (!validator.isLength(data.newPassword2, {min: 6, max: 32})) {
			client.red({notice: {title:'LỖI', text: 'Độ dài mật khẩu từ 6 đến 32 ký tự !!'}});
		} else if (data.password == data.newPassword){
			client.red({notice: {title:'LỖI', text: 'Mật khẩu mới không trùng với mật khẩu cũ.!!'}});
		} else if (data.newPassword != data.newPassword2){
			client.red({notice: {title:'LỖI', text: 'Nhập lại mật khẩu không đúng!!'}});
		} else {
			Admin.findOne({'_id': client.UID}, function(err, user){
				if (user !== null) {
					if (Helper.validPassword(data.password, user.password)) {
						Admin.updateOne({'_id': client.UID}, {$set:{'password':Helper.generateHash(data.newPassword)}}).exec();
						client.red({notice:{title:'ĐỔI MẬT KHẨU',text:'Đổi mật khẩu thành công.'}});
					}else{
						client.red({notice:{title:'ĐỔI MẬT KHẨU',text:'Mật khẩu cũ không đúng.'}});
					}
				}
			});
		}
	}
}

function onData(client, data) {
	if (!!data) {
		if (!!data.doi_pass) {
			changePassword(client, data.doi_pass)
		}
	}
}

module.exports = {
	first: first,
	onData: onData,
}
