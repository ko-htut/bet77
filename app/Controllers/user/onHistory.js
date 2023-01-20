
var NapThe      = require('../../Models/NapThe');

var MuaThe      = require('../../Models/MuaThe');
var MuaThe_card = require('../../Models/MuaThe_card');

var MuaXu       = require('../../Models/MuaXu');
var ChuyenRed   = require('../../Models/ChuyenRed');

var Bank_history = require('../../Models/Bank/Bank_history');


var Helper      = require('../../Helpers/Helpers');

function historyNapRed(client, data){
	if(!!data && !!data.page){
		var page  = data.page>>0;
		var kmess = 8;
		if (page > 0) {
			NapThe.countDocuments({'uid': client.UID}).exec(function(err, total){
				NapThe.find({'uid': client.UID}, 'menhGia nhaMang nhan maThe seri status time', {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					client.red({profile:{history:{nap_red:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}

function historyMuaThe(client, data){
	if(!!data && !!data.page){
		var page  = data.page>>0;
		var kmess = 8;
		if (page > 0) {
			MuaThe.countDocuments({'uid': client.UID}).exec(function(err, total){
				MuaThe.find({'uid': client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					client.red({profile:{history:{mua_the:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}

function historyMuaXu(client, data){
	if(!!data && !!data.page){
		var page  = data.page>>0;
		var kmess = 10;
		if (page > 0) {
			MuaXu.countDocuments({uid: client.UID}).exec(function(err, total){
				MuaXu.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					client.red({profile:{history:{mua_xu:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}

function historyChuyenRed(client, data){
	if(!!data && !!data.page){
		var page  = data.page>>0;
		var kmess = 8;
		if (page > 0) {
			ChuyenRed.countDocuments({$or:[{'from':client.profile.name}, {'to':client.profile.name}]}).exec(function(err, total){
				ChuyenRed.find({$or:[{'from':client.profile.name}, {'to':client.profile.name}]}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
					client.red({profile:{history:{chuyen_red:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}

function the_cao(client, id){
	if (!!id) {
		MuaThe.findOne({'_id': id, 'uid': client.UID}, function(err, card) {
			if (!!card) {
				MuaThe_card.find({'cart': id}, function(err, data){
					client.red({profile:{the_cao:data}});
				});
			}
		});
	}
}

function bank(client, data){
	if(!!data && !!data.page){
		var page  = data.page>>0;
		var kmess = 10;
		if (page > 0) {
			Bank_history.countDocuments({'uid':client.UID}).exec(function(err, total){
				Bank_history.find({'uid':client.UID}, {}, {sort:{'_id':-1}, skip:(page-1)*kmess, limit:kmess}, function(err, result) {
					client.red({profile:{history:{bank:result, page:page, kmess:kmess, total:total}}});
				});
			});
		}
	}
}

module.exports = function(client, data) {
	if (!!data) {
		if (!!data.nap_red) {
			historyNapRed(client, data.nap_red)
		}

		if (!!data.mua_the) {
			historyMuaThe(client, data.mua_the)
		}

		if (!!data.mua_xu) {
			historyMuaXu(client, data.mua_xu)
		}

		if (!!data.chuyen_red) {
			historyChuyenRed(client, data.chuyen_red)
		}

		if (!!data.the_cao) {
			the_cao(client, data.the_cao)
		}

		if (!!data.bank) {
			bank(client, data.bank)
		}
		
	}
};
