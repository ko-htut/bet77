
const TX_User  = require('../../../../Models/TaiXiu_user');
const UserInfo = require('../../../../Models/UserInfo');

function viewDashboard(client, red){
	red = !!red;
	var waitTX_Win = new Promise((a, b) => { // Top 50 Dây thắng tài xỉu hiện tại
		TX_User.find({}, 'uid tLineWinRed tLineWinRedH tLineWinXu tLineWinXuH', {sort: red ? {'tLineWinRedH': -1} : {'tLineWinXuH': -1}, limit: 50}, function(err, data){
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getUser]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				a(arrayOfResults);
			})
		});
	});
	var waitTX_Lost = new Promise((a, b) => { // Top 50 Dây Thua tài xỉu hiện tại
		TX_User.find({}, 'uid tLineLostRed tLineLostRedH tLineLostXu tLineLostXuH', {sort: red ? {'tLineLostRedH': -1} : {'tLineLostXuH': -1}, limit: 50}, function(err, data){
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getUser]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				a(arrayOfResults);
			})
		});
	});
	var waitCL_Win = new Promise((a, b) => { // Top 50 Dây thắng Chẵn lẻ hiện tại
		TX_User.find({}, 'uid cLineWinRed cLineWinRedH cLineWinXu cLineWinXuH', {sort: red ? {'cLineWinRedH': -1} : {'cLineWinXuH': -1}, limit: 50}, function(err, data){
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getUser]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				a(arrayOfResults);
			})
		});
	});
	var waitCL_Lost = new Promise((a, b) => { // Top 50 Dây Thua Chẵn lẻ hiện tại
		TX_User.find({}, 'uid cLineLostRed cLineLostRedH cLineLostXu cLineLostXuH', {sort: red ? {'cLineLostRedH': -1} : {'cLineLostXuH': -1}, limit: 50}, function(err, data){
			Promise.all(data.map(function(obj){
				obj = obj._doc;
				var getUser = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getUser]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				a(arrayOfResults);
			})
		});
	});
	Promise.all([waitTX_Win, waitTX_Lost, waitCL_Win, waitCL_Lost])
	.then(values => {
		client.red({taixiu:{dashboard:{dTXWin: values[0], dTXLost: values[1], dCLWin: values[2], dCLLost: values[3]}}});
	});
}

function get_top(client, data){
	if (!!data && !!data.page && !!data.sort) {
		var red   = !!data.red;
		var page  = data.page>>0;
		var sort  = data.sort>>0;
		var kmess = 10;

		if (page > 0) {
			// Project
			var project = {};
				project.uid      = '$uid';
			if (red) { // Red
				project.profitTX = {$subtract: ['$tWinRed', '$tLostRed']};
				project.profitCL = {$subtract: ['$cWinRed', '$cLostRed']};
				project.tWin     = '$tWinRed';
				project.tLost    = '$tLostRed';
				project.cWin     = '$cWinRed';
				project.cLost    = '$cLostRed';
			}else{ // Xu
				project.profitTX = {$subtract: ['$tWinXu', '$tLostXu']};
				project.profitCL = {$subtract: ['$cWinXu', '$cLostXu']};
				project.tWin     = '$tWinXu';
				project.tLost    = '$tLostXu';
				project.cWin     = '$cWinXu';
				project.cLost    = '$cLostXu';
			}

			// sort
			var sort = {};
			if (data.sort == '1') {
				sort.tWin = 1;
			}else if (data.sort == '2') {
				sort.tWin = -1;


			}else if (data.sort == '3') {
				sort.tLost = -1;
			}else if (data.sort == '4') {
				sort.tLost = 1;


			}else if (data.sort == '5') {
				sort.profitTX = -1;
			}else if (data.sort == '6') {
				sort.profitTX = 1;


			}else if (data.sort == '7') {
				sort.cWin = -1;
			}else if (data.sort == '8') {
				sort.cWin = 1;


			}else if (data.sort == '9') {
				sort.cLost = -1;
			}else if (data.sort == '10') {
				sort.cLost = 1;


			}else if (data.sort == '11') {
				sort.profitCL = -1;
			}else if (data.sort == '12') {
				sort.profitCL = 1;


			}else{
				sort.profitTX = -1;
			}

			// count total
			TX_User.aggregate([
				{$count: 'total'},
			]).exec(function(err, countFind){
				TX_User.aggregate([
					{$project: project},
					{$sort: sort},
					{$skip: (page-1)*kmess},
					{$limit: kmess}
				]).exec(function(err, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							return new Promise(function(resolve, reject) {
								UserInfo.findOne({'id': obj.uid}, function(error, result2){
									delete obj._id;
									delete obj.uid;
									obj['name'] = result2.name;
									resolve(obj);
								})
							})
						}))
						.then(function(data){
							client.red({taixiu:{dashboard:{get_users:{data:data, page:page, kmess:kmess, total:countFind[0].total}}}});
						})
					}else{
						client.red({taixiu:{dashboard:{get_users:{data:[], page:1, kmess:10, total:0}}}});
					}
				});
			});
		}
	}
}

module.exports = function(client, data) {
	if (void 0 !== data.view) {
		viewDashboard(client, data.view);
	}
	if (void 0 !== data.get_top) {
		get_top(client, data.get_top);
	}
}
