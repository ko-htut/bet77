
var Users     = require('../../../../Models/Users');
var UserInfo  = require('../../../../Models/UserInfo');

var get_info  = require('./get_info');
var validator = require('validator');

var Helper    = require('../../../../Helpers/Helpers');

module.exports = function(client, data){
	if (!!data && !!data.id && !!data.data) {
		var uData = data.data;
		var update = {};
		var password = null;
		if (!!uData.phone && Helper.checkPhoneValid(uData.phone)) {
			update['phone'] = uData.phone;
		}
		if (!!uData.email && Helper.validateEmail(uData.email)) {
			update['email'] = uData.email;
		}
		if (!!uData.cmt && validator.isLength(uData.cmt, {min:9, max: 12})) {
			update['cmt'] = uData.cmt;
		}
		if (!!uData.red && !validator.isEmpty(uData.red)) {
			update['red'] = Helper.getOnlyNumberInString(uData.red);
		}
		if (!!uData.xu && !validator.isEmpty(uData.xu)) {
			update['xu'] = Helper.getOnlyNumberInString(uData.xu);
		}
		if (!!uData.type && uData.type != '0') {
			update['type'] = uData.type == '1' ? true : false;
		}

		if (!!Object.entries(update).length) {
			UserInfo.findOne({'id': data.id}, function(err, check) {
				if (check) {
					get_info(client, data.id);
					client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
					UserInfo.updateOne({'id': data.id}, {$set:update}).exec();
				}else{
					client.red({notice:{title:'NGƯỜI DÙNG', text:'Người dùng không tồn tại...'}});
				}
			})
		}
		if (!!uData.pass && validator.isLength(uData.pass, {min:6, max: 32})) {
			password = Helper.generateHash(uData.pass);
			Users.updateOne({'_id': data.id}, {$set:{'local.password':password}}).exec();
			client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
		}
	}
}
