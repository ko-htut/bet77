
const Users    = require('../../../../Models/Users');
const UserInfo = require('../../../../Models/UserInfo');
const Phone    = require('../../../../Models/Phone');

const isEmpty    = require('../../../../Helpers/Helpers').isEmpty;
const phoneCrack = require('../../../../Helpers/Helpers').phoneCrack;


module.exports = function(client, data){
	if (!!data && !!data.page) {
		var page  = data.page>>0;
		var kmess = 10;

		if (page > 0) {

			// sort
			var sort = {};
			if (data.sort == '1') {
				sort._id = 1;
			}else if (data.sort == '2') {
				sort._id = -1;

			}else if (data.sort == '3') {
				sort.profit = -1;
			}else if (data.sort == '4') {
				sort.profit = 1;

			}else if (data.sort == '5') {
				sort.red = -1;
			}else if (data.sort == '6') {
				sort.red = 1;

			}else if (data.sort == '7') {
				sort.xu = -1;
			}else if (data.sort == '8') {
				sort.xu = 1;

			}else{
				sort.profit = -1;
			}

			// match
			var match     = {};

			if (!isEmpty(data.uid)) {
				match.UID = data.uid>>0;
			}
			if (!isEmpty(data.name)) {
				var name =''+data.name+'';
				name = name.toLowerCase();
				match.name = name;
			}
			if (data.macth == 1) {
				match.type = false;
			}else if (data.macth == 2) {
				match.type = true;
			}

			if (!isEmpty(data.nick)) {
				var nick =''+data.nick+'';
				nick = nick.toLowerCase();
				Users.findOne({'local.username':nick}, function(error, result){
					if (!!result) {
						match.id = result._id.toString();
						UserInfo.aggregate([
							{$match: match},
							{
								$project:{
									profit: {$subtract: ['$redWin', '$redLost']},
									id:       '$id',
									UID:      '$UID',
									name:     '$name',
									red:      '$red',
									xu:       '$xu',
									type:     '$type',
								}
							},
						]).exec(function(err, result2){
							if (result2.length) {
								Promise.all(result2.map(function(obj){
									delete obj._id;
									obj.username = result.local.username;
									return new Promise(function(resolve, reject) {
										Phone.findOne({'uid':obj.id}, function(err3, result4){
											obj.phone = !!result4 ? result4.region+result4.phone : '';
											resolve(obj);
										});
									});
								}))
								.then(function(data){
									client.red({users:{get_users:{data:data, page:page, kmess:10, total:1}}});
								})
							}else{
								client.red({users:{get_users:{data:[], page:1, kmess:10, total:0}}});
							}
						});
					}else{
						client.red({users:{get_users:{data:[], page:1, kmess:10, total:0}}});
					}
				});
			}else if (!isEmpty(data.phone)) {
				var pCrack = phoneCrack(data.phone);
				if (pCrack) {
					Phone.findOne({'phone':pCrack.phone}, function(error, result){
						if (!!result) {
							match.id = result.uid;
							UserInfo.aggregate([
								{$match: match},
								{
									$project:{
										profit: {$subtract: ['$redWin', '$redLost']},
										id:       '$id',
										UID:      '$UID',
										name:     '$name',
										red:      '$red',
										xu:       '$xu',
										type:     '$type',
									}
								},
							]).exec(function(err, result2){
								if (result2.length) {
									Promise.all(result2.map(function(obj){
										delete obj._id;
										obj.phone = result.region+result.phone;
										return new Promise(function(resolve, reject) {
											Users.findOne({'_id': obj.id}, function(error, result3){
												obj.username = result3.local.username;
												resolve(obj);
											})
										});
									}))
									.then(function(data){
										client.red({users:{get_users:{data:data, page:page, kmess:10, total:1}}});
									})
								}else{
									client.red({users:{get_users:{data:[], page:1, kmess:10, total:0}}});
								}
							});
						}else{
							client.red({users:{get_users:{data:[], page:1, kmess:10, total:0}}});
						}
					});
				}else{
					client.red({users:{get_users:{data:[], page:1, kmess:10, total:0}}});
				}
			}else{
				// count total
				UserInfo.aggregate([
					{$match: match},
					{$count: 'total'},
				]).exec(function(err, countFind){
					UserInfo.aggregate([
						{$match: match},
						{
							$project:{
								profit: {$subtract: ['$redWin', '$redLost']},
								id:       '$id',
								UID:      '$UID',
								name:     '$name',
								red:      '$red',
								xu:       '$xu',
								type:     '$type',
							}
						},
						{$sort: sort},
						{$skip: (page-1)*kmess},
						{$limit: kmess}
					]).exec(function(err, result){
						if (result.length) {
							Promise.all(result.map(function(obj){
								delete obj._id;
								return new Promise(function(resolve, reject) {
									Users.findOne({'_id': obj.id}, function(error, result2){
										obj.username = !!result2 ? result2.local.username : '';
										Phone.findOne({'uid':obj.id}, function(err3, result3){
											obj.phone = !!result3 ? result3.region+result3.phone : '';
											resolve(obj);
										});
									})
								})
							}))
							.then(function(data){
								client.red({users:{get_users:{data:data, page:page, kmess:kmess, total:countFind[0].total}}});
							})
						}else{
							client.red({users:{get_users:{data:[], page:1, kmess:10, total:0}}});
						}
					});
				});
			}
		}
	}
}
