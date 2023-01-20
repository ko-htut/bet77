
var bank   = require('./Bank/index');
var Remove = require('./Shop/Remove');

var tabDaiLy   = require('../../../Models/DaiLy');
var tabNhaMang = require('../../../Models/NhaMang');
var tabMenhGia = require('../../../Models/MenhGia');

var Helper     = require('../../../Helpers/Helpers');

function DaiLy_add(client, data){
	if (!!data && !!data.name && !!data.nickname && !!data.phone && !!data.fb) {
		var name     = data.name;
		var nickname = ''+data.nickname+'';
		var phone    = data.phone;
		var fb       = data.fb;
		if (Helper.isEmpty(name) || Helper.isEmpty(nickname) || Helper.isEmpty(phone) || Helper.isEmpty(fb)) {
			client.red({notice:{title:'ĐẠI LÝ',text:'Không bỏ trống các thông tin...'}});
		}else{
			nickname = nickname.toLowerCase();
			tabDaiLy.findOne({'nickname':nickname}, function(err, check){
				if (!!check) {
					client.red({notice:{title:'ĐẠI LÝ',text:'NICKNAME đã tồn tại...'}});
				}else{
					try {
						tabDaiLy.create({'name':name, 'nickname':nickname, 'phone':phone, 'fb':fb}, function(errC, dataC) {
							if (!!dataC) {
								tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
									client.red({daily:{data:data}, notice:{title:'ĐẠI LÝ',text:'Thêm đại lý thành công...'}});
								});
							}
						});
					} catch (err) {
						client.red({notice:{title:'ĐẠI LÝ',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}});
					}
				}
			});
		}
	}
}

function DaiLy_remove(client, id){
	if (!!id) {
		tabDaiLy.findOne({'_id': id}, function(err, data){
			if (data) {
				var active = tabDaiLy.findOneAndRemove({'_id': id}).exec();
				Promise.all([active])
				.then(values => {
					tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
						client.red({daily:{data:data, remove:true}, notice:{title:'ĐẠI LÝ',text:'Xoá thành công...'}});
					});
				})
			}else{
				tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
					client.red({daily:{data:data, remove:true}, notice:{title:'ĐẠI LÝ',text:'Đại lý không tồn tại...'}});
				});
			}
		});
	}
}

function DaiLy_get(client){
	tabDaiLy.find({}, {}, {sort:{'_id':-1}}, function(err, data){
		client.red({daily:{data:data}});
	});
}

function DaiLy(client, data){
	if (void 0 !== data.add) {
		DaiLy_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		DaiLy_remove(client, data.remove)
	}
	if (void 0 !== data.get_data) {
		DaiLy_get(client)
	}
}



function NhaMang_add(client, data){
	if (!!data && !!data.name && !!data.value) {
		var name = data.name;
		var code = data.value;
		var nap  = !!data.nap;
		var mua  = !!data.mua;
		if (Helper.isEmpty(name) || (!nap && !mua)) {
			client.red({notice:{title:'THÊM NHÀ MẠNG',text:'Không bỏ trống các thông tin...'}});
		}else{
			tabNhaMang.findOne({'name': name, 'nap': nap, 'mua': mua}, function(err, check){
				if (!!check) {
					client.red({notice:{title:'THÊM NHÀ MẠNG',text:'Nhà mạng đã tồn tại...'}});
				}else{
					try {
						tabNhaMang.create({'name':name, 'value':code, 'nap':nap, 'mua':mua}, function(errC, create){
							if (!!create) {
								tabNhaMang.find({}, function(err, data){
									client.red({thecao:{nhamang:data}, notice:{title:'THÊM NHÀ MẠNG',text:'Thêm NHÀ MẠNG thành công...'}});
								});
							}
						});
					} catch (err) {
						client.red({notice:{title:'THÊM NHÀ MẠNG',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}});
					}
				}
			});
		}
	}
}
function NhaMang_remove(client, id){
	if (!!id) {
		tabNhaMang.findOne({'_id': id}, function(err, check){
			if (check) {
				var active = tabNhaMang.findOneAndRemove({'_id': id}).exec();
				Promise.all([active])
				.then(values => {
					tabNhaMang.find({}, function(err, data){
						client.red({thecao:{nhamang:data, remove: true}, notice:{title:'XOÁ NHÀ MẠNG',text:'Xoá thành công...'}});
					});
				})
			}else{
				tabNhaMang.find({}, function(err, data){
					client.red({thecao:{nhamang:data, remove: true}, notice:{title:'XOÁ NHÀ MẠNG',text:'Nhà mạng không tồn tại...'}});
				});
			}
		});
	}
}

function NhaMang(client, data){
	if (void 0 !== data.add) {
		NhaMang_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		NhaMang_remove(client, data.remove)
	}
}

function MenhGia_add(client, data){
	if (!!data && !!data.name && !!data.values) {
		var name   = data.name;
		var values = data.values;
		var nap    = !!data.nap;
		var mua    = !!data.mua;
		if (Helper.isEmpty(name) || Helper.isEmpty(values) || (!nap && !mua)) {
			client.red({notice:{title:'THÊM MỆNH GIÁ',text:'Không bỏ trống các thông tin...'}});
		}else{
			tabMenhGia.findOne({'name': name, 'values': values, 'nap': nap, 'mua': mua} , async function(err, check){
				if (!!check) {
					client.red({notice:{title:'THÊM MỆNH GIÁ',text:'Mệnh giá đã tồn tại...'}});
				}else{
					try {
						tabMenhGia.create({'name':name, 'values':values, 'nap':nap, 'mua':mua}, function(errC, create){
							if (!!create) {
								tabMenhGia.find({}, function(err, data){
									client.red({thecao:{menhgia:data}, notice:{title:'THÊM MỆNH GIÁ',text:'Thêm MỆNH GIÁ thành công...'}});
								});
							}
						});
					} catch (err) {
						client.red({notice:{title:'THÊM MỆNH GIÁ',text:'Có lỗi sảy ra, xin vui lòng thử lại.'}});
					}
				}
			});
		}
	}
}

function MenhGia_remove(client, id){
	if (!!id) {
		tabMenhGia.findOne({'_id': id}, function(err, check){
			if (check) {
				var active = tabMenhGia.findOneAndRemove({'_id': id}).exec();
				Promise.all([active])
				.then(values => {
					tabMenhGia.find({}, function(err, data){
						client.red({thecao:{menhgia:data, remove: true}, notice:{title:'XOÁ MỆNH GIÁ',text:'Xoá thành công...'}});
					});
				})
			}else{
				tabMenhGia.find({}, function(err, data){
					client.red({thecao:{menhgia:data, remove: true}, notice:{title:'XOÁ MỆNH GIÁ',text:'Mệnh giá không tồn tại...'}});
				});
			}
		});
	}
}

function MenhGia(client, data){
	if (void 0 !== data.add) {
		MenhGia_add(client, data.add)
	}
	if (void 0 !== data.remove) {
		MenhGia_remove(client, data.remove)
	}
}

function thecao_get(client, data){
	if (!!data && !!data.nhamang && !!data.menhgia) {
		var active = [];
		if (void 0 !== data.nhamang) {
			var active1 = new Promise((ketqua, loi)=>{
				tabNhaMang.find({}, function(err, data){
					ketqua({nhamang:data})
				});
			});
			active = [active1, ...active];
		}
		if (void 0 !== data.menhgia) {
			var active2 = new Promise((ketqua, loi)=>{
				tabMenhGia.find({}, function(err, data){
					ketqua({menhgia:data})
				});
			});
			active = [active2, ...active];
		}
		Promise.all(active).then(resulf => {
			var df = {};
			Promise.all(resulf.map(function(obj){
				df = Object.assign(df, obj);
				return true;
			})).then(resulf => {
				client.red({thecao: df});
			})
		})
	}
}

module.exports = function (client, data) {
	if (!!data) {
		if (void 0 !== data.daily) {
			DaiLy(client, data.daily)
		}
		if (void 0 !== data.nhamang) {
			NhaMang(client, data.nhamang)
		}
		if (void 0 !== data.menhgia) {
			MenhGia(client, data.menhgia)
		}
		if (void 0 !== data.thecao_get) {
			thecao_get(client, data.thecao_get)
		}
		if (!!data.remove) {
			Remove(client, data.remove);
		}

		if (!!data.bank) {
			bank(client, data.bank)
		}
	}
}
