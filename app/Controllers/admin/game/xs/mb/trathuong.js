
let xsmb      = require('../../../../../Models/XoSo/mb/xsmb');
let xsmb_cuoc = require('../../../../../Models/XoSo/mb/xsmb_cuoc');
let UserInfo  = require('../../../../../Models/UserInfo');

module.exports = function(client, date) {
	let banDate = new Date();
	banDate.setHours(18, 30, 0, 0);
	let timeCL = banDate - new Date();
	if(timeCL > 0){
		client.red({xs:{mb:{kq:{notice:'Trả thưởng hiệu lực sau: 18:30 hàng ngày...'}}}});
	}else{
		xsmb.findOne({date:date}, {}, function(err, data){
			if (!!data) {
				if (data.pay) {
					client.red({xs:{mb:{kq:{notice:'Phiên đã Trả thưởng...'}}}});
				}else{
					xsmb_cuoc.find({date:date}, {}, function(errC, cuoc){
						if (cuoc.length > 0) {
							// tách lô 2 số
							let lo2so = [data.g1.substring(data.g1.length-2), data.gdb.substring(data.gdb.length-2), ...data.g2.map(function(obj){return obj.substring(obj.length-2)}), ...data.g3.map(function(obj){return obj.substring(obj.length-2)}), ...data.g4.map(function(obj){return obj.substring(obj.length-2)}), ...data.g5.map(function(obj){return obj.substring(obj.length-2)}), ...data.g6.map(function(obj){return obj.substring(obj.length-2)}), ...data.g7.map(function(obj){return obj.substring(obj.length-2)})];
							lo2so = lo2so.filter(function(obj){
								return obj !== '';
							});
							if (lo2so.length !== 27) {
								client.red({xs:{mb:{kq:{notice:'Hãy lưu đầy đủ các giải để tiến hàng trả thưởng...'}}}});
							}else{
								client.red({xs:{mb:{kq:{notice:'Trả thưởng thành công...'}}}});
								// tách lô 3 số
								let lo3so = [data.g1.substring(data.g1.length-3), data.gdb.substring(data.gdb.length-3), ...data.g2.map(function(obj){return obj.substring(obj.length-3)}), ...data.g3.map(function(obj){return obj.substring(obj.length-3)}), ...data.g4.map(function(obj){return obj.substring(obj.length-3)}), ...data.g5.map(function(obj){return obj.substring(obj.length-3)}), ...data.g6.map(function(obj){return obj.substring(obj.length-3)})];

								// tách lô 4 số
								let lo4so = [data.g1.substring(data.g1.length-4), data.gdb.substring(data.gdb.length-4), ...data.g2.map(function(obj){return obj.substring(obj.length-4)}), ...data.g3.map(function(obj){return obj.substring(obj.length-4)}), ...data.g4.map(function(obj){return obj.substring(obj.length-4)}), ...data.g5.map(function(obj){return obj.substring(obj.length-4)})];

								let de      = data.gdb.substring(data.gdb.length-2);
								let daude   = data.gdb.substring(0, 2);
								let degiai7 = [...new Set(data.g7)];
								let degiai1 = data.g1.substring(data.g1.length-2)
								let cang3   = data.gdb.substring(data.gdb.length-3);
								let cang4   = data.gdb.substring(data.gdb.length-4);
								let dau     = data.gdb.charAt();
								let duoi    = data.gdb.charAt(data.gdb.length-1);

								let lo2soNot2 = [...new Set(lo2so)]; // loại bỏ trùng nặp lô 2 số
								let tongCuoc = 0;
								let tongTra  = 0;

								data.pay = true;

								cuoc.forEach(function(objC){
									tongCuoc += objC.cuoc*1;
									let diem = objC.diem;
									let win = 0;
									let trung = 0;
									objC.thanhtoan = true;
									switch(objC.type) {
										case 'lo2':
											// 'Lô 2 Số'
											objC.so.forEach(function(so){
												lo2so.forEach(function(item){
													if (so === item) {
														win += diem*80000;
													}
												});
											});
											break;
										case 'lo21k':
											// 'Lô 2 Số 1k'
											objC.so.forEach(function(so){
												lo2so.forEach(function(item){
													if (so === item) {
														win += diem*3636;
													}
												});
											});
											break;
										case 'lo3':
											// 'Lô 3 Số'
											objC.so.forEach(function(so){
												lo3so.forEach(function(item){
													if (so === item) {
														win += diem*960000;
													}
												});
											});
											break;
										case 'lo4':
											// 'Lô 4 Số'
											objC.so.forEach(function(so){
												lo4so.forEach(function(item){
													if (so === item) {
														win += diem*8880000;
													}
												});
											});
											break;
										case 'xien2':
											// 'Xiên 2'
											trung = 0;
											objC.so.forEach(function(so){
												lo2soNot2.forEach(function(item){
													if (so === item) {
														trung++;
													}
												});
											});
											if (trung === 2) {
												win += diem*16000;
											}
											break;
										case 'xien3':
											// 'Xiên 3'
											trung = 0;
											objC.so.forEach(function(so){
												lo2soNot2.forEach(function(item){
													if (so === item) {
														trung++;
													}
												});
											});
											if (trung === 3) {
												win += diem*65000;
											}
											break;
										case 'xien4':
											// 'Xiên 4'
											trung = 0;
											objC.so.forEach(function(so){
												lo2soNot2.forEach(function(item){
													if (so === item) {
														trung++;
													}
												});
											});
											if (trung === 4) {
												win += diem*180000;
											}
											break;
										case 'de':
											// 'Đề'
											objC.so.forEach(function(so){
												if (so === de) {
													win += diem*70000;
												}
											});
											break;
										case 'daude':
											// 'Đầu Đề'
											objC.so.forEach(function(so){
												if (so === daude) {
													win += diem*70000;
												}
											});
											break;
										case 'degiai7':
											// 'Đề Giải 7'
											objC.so.forEach(function(so){
												degiai7.forEach(function(item){
													if (so === item) {
														win += diem*69000;
													}
												});
											});
											break;
										case 'degiai1':
											// 'Đề Giải Nhất'
											objC.so.forEach(function(so){
												if (so === degiai1) {
													win += diem*69000;
												}
											});
											break;
										case '3cang':
											// '3 Càng'
											objC.so.forEach(function(so){
												if (so === cang3) {
													win += diem*960000;
												}
											});
											break;
										case '4cang':
											// '4 Càng'
											objC.so.forEach(function(so){
												if (so === cang4) {
													win += diem*8880000;
												}
											});
											break;
										case 'dau':
											// 'Đầu'
											objC.so.forEach(function(so){
												if (so === dau) {
													win += diem*7000;
												}
											});
											break;
										case 'duoi':
											// 'Đuôi'
											objC.so.forEach(function(so){
												if (so === duoi) {
													win += diem*7000;
												}
											});
											break;
										case 'truot4':
											// 'Trượt 4'
											trung = 0;
											objC.so.forEach(function(so){
												lo2soNot2.forEach(function(item){
													if (so === item) {
														trung++;
													}
												});
											});
											if (trung === 0) {
												win += diem*2300;
											}
											break;
										case 'truot8':
											// 'Trượt 8'
											trung = 0;
											objC.so.forEach(function(so){
												lo2soNot2.forEach(function(item){
													if (so === item) {
														trung++;
													}
												});
											});
											if (trung === 0) {
												win += diem*8000;
											}
											break;
										case 'truot10':
											// 'Trượt 10'
											trung = 0;
											objC.so.forEach(function(so){
												lo2soNot2.forEach(function(item){
													if (so === item) {
														trung++;
													}
												});
											});
											if (trung === 0) {
												win += diem*12000;
											}
											break;
									}
									if (win > 0) {
										tongTra += win;
										objC.win = win;
										UserInfo.updateOne({name:objC.name}, {$inc:{red:win}}).exec();
									}
									objC.save();
								});
								data.cuoc = tongCuoc;
								data.tra = tongTra;
								data.save();
							}
						}else{
							client.red({xs:{mb:{kq:{notice:'Không có người cược...'}}}});
						}
					});
				}
			}else{
				client.red({xs:{mb:{kq:{notice:'Trả thưởng thất bại...'}}}});
			}
		});
	}
}
