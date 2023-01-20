
var UserInfo  = require('../../Models/UserInfo');
var OTP       = require('../../Models/OTP');
var Phone     = require('../../Models/Phone');

var validator = require('validator');
var helper    = require('../../Helpers/Helpers');
var sms       = require('../../sms').sendOTP;

function sendOTP(client, phone){
	// Gửi OTP kích hoạt
	if (!!phone && helper.checkPhoneValid(phone)) {
		var phoneCrack = helper.phoneCrack(phone);
		if (phoneCrack) {
			if (phoneCrack.region == '0' || phoneCrack.region == '84') {
				phoneCrack.region = '+84';
			}
			UserInfo.findOne({'id': client.UID}, 'red otpFirst', function(err2, user){
				if (user) {
					Phone.findOne({'phone':phoneCrack.phone}, function(err1, crack){
						if (crack) {
							client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
						}else{
							var otp = (Math.random()*(9999-1000+1)+1000)>>0; // từ 1000 đến 9999
							OTP.findOne({'uid':client.UID, 'phone':phoneCrack.phone}, {}, {sort:{'_id':-1}}, function(err2, data){
								if (!data || (new Date()-Date.parse(data.date))/1000 > 180 || data.active) {
									Phone.findOne({'uid':client.UID}, function(err3, check){
										if (check) {
											client.red({notice:{title:'LỖI', text:'Bạn đã kích hoạt OTP.!'}, user:{phone: helper.cutPhone(check.region+check.phone)}});
										}else{
											if (user.otpFirst) {
												if (user.red < 1000) {
													client.red({notice:{title:'THÔNG BÁO', text:'Số dư không khả dụng.'}});
												}else{
													sms(phoneCrack.region+phoneCrack.phone, otp);
													OTP.create({'uid':client.UID, 'phone':phoneCrack.phone, 'code':otp, 'date':new Date()});
													UserInfo.updateOne({id:client.UID}, {$inc:{red:-1000}}).exec();
													client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP đã được gửi tới số điện thoại của bạn.'}});
												}
											}else{
												sms(phoneCrack.region+phoneCrack.phone, otp);
												OTP.create({'uid':client.UID, 'phone':phoneCrack.phone, 'code':otp, 'date':new Date()});
												UserInfo.updateOne({id:client.UID}, {$set:{otpFirst:true}}).exec();
												client.red({notice:{title:'THÔNG BÁO', text:'Mã OTP đã được gửi tới số điện thoại của bạn.'}});
											}
										}
									});
								}else{
									client.red({notice:{title:'OTP', text:'Vui lòng kiểm tra hộp thư đến.!'}});
								}
							});
						}
					});
				}
			});
		}else{
			client.red({notice:{title:'THÔNG BÁO', text:'Số điện thoại không hợp lệ.!'}});
		}
	}else{
		client.red({notice:{title:'THÔNG BÁO', text:'Số điện thoại không hợp lệ.!'}});
	}
}

function regOTP(client, data){
	if (!!data && !!data.phone && !!data.email && !!data.cmt && !!data.otp) {
		if (!helper.checkPhoneValid(data.phone)) {
			client.red({notice: {title:'LỖI', text: 'Số điện thoại không hợp lệ'}});
		}else if (!helper.validateEmail(data.email)) {
			client.red({notice: {title:'LỖI', text: 'Email không hợp lệ...'}});
		} else if (!validator.isLength(data.cmt, {min: 9, max: 12})){
			client.red({notice: {title:'LỖI', text: 'Số CMT không hợp lệ.!!'}});
		} else if (!validator.isLength(data.otp, {min: 4, max: 6})){
			client.red({notice: {title:'LỖI', text: 'Mã OTP Không đúng!!'}});
		} else {
			var phoneCrack = helper.phoneCrack(data.phone);
			if (phoneCrack) {
				if (phoneCrack.region == '0' || phoneCrack.region == '84') {
					phoneCrack.region = '+84';
				}
				OTP.findOne({'uid':client.UID, 'phone':phoneCrack.phone}, {}, {sort:{'_id':-1}}, function(err1, data_otp){
					if (data_otp && data.otp == data_otp.code) {
						if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
							client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!'}});
						}else{
							UserInfo.findOne({'id': client.UID}, 'red xu phone email cmt', function(err2, dU){
								if (dU) {
									Phone.findOne({'phone':phoneCrack.phone}, function(err3, crack){
										if (crack) {
											client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
										}else{
											Phone.findOne({'uid':client.UID}, function(err4, check){
												if (check) {
													client.red({notice:{title:'LỖI', text:'Bạn đã kích hoạt OTP.!'}, user:{phone: helper.cutPhone(check.region+check.phone)}});
												}else{
													// Xác thực thành công
													data_otp.active = true;
													data_otp.save();
													try {
														Phone.create({'uid':client.UID, 'phone':phoneCrack.phone, 'region':phoneCrack.region}, function(err, cP){
															if (!!cP) {
																UserInfo.updateOne({id:client.UID}, {$set:{email:data.email, cmt:data.cmt, otpGet:0}, $inc:{red:3000, xu:10000}}).exec();
																client.red({notice:{title:'THÀNH CÔNG', text: 'Xác thực thành công.!' + '\n' + 'Bạn nhận được 3.000 Red và 10.000 Xu, chúc bạn chơi game vui vẻ...'}, user: {red: dU.red*1+3000, xu: dU.xu*1+10000, phone: helper.cutPhone(data.phone), email: helper.cutEmail(data.email), cmt: data.cmt}});
															}else{
																client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
															}
														});
													} catch (error) {
														client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
													}
												}
											});
										}
									});
								}
							});
						}
					}else{
						client.red({notice:{title:'LỖI', text:'Mã OTP Không đúng.!'}});
					}
				});
			}else{
				client.red({notice:{title:'THÔNG BÁO', text:'Số điện thoại không hợp lệ.!'}});
			}
		}
	}
}

module.exports = function(client, data) {
	if (!!data) {
		if (!!data.sendOTP) {
			sendOTP(client, data.sendOTP);
		}
		if (!!data.regOTP) {
			regOTP(client, data.regOTP);
		}
	}
}
