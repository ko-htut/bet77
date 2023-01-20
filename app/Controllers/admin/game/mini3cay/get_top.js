
const Mini3Cay_users = require('../../../../Models/Mini3Cay/Mini3Cay_user');
const Mini3Cay_red   = require('../../../../Models/Mini3Cay/Mini3Cay_red');

const UserInfo       = require('../../../../Models/UserInfo');

module.exports = function(client, data) {
	if (!!data && !!data.page && !!data.sort) {
		var page = data.page>>0;
		var sort = data.sort>>0;
		var kmess = 9;
		if (page > 0) {

			// sort
			var sort = {};
			if (data.sort == '1') {
				sort.bet = -1;
			}else if (data.sort == '2') {
				sort.bet = 1;


			}else if (data.sort == '3') {
				sort.win = -1;
			}else if (data.sort == '4') {
				sort.win = 1;


			}else if (data.sort == '5') {
				sort.lost = -1;
			}else if (data.sort == '6') {
				sort.lost = 1;


			}else if (data.sort == '7') {
				sort.profit = -1;
			}else if (data.sort == '8') {
				sort.profit = 1;

			}else if (data.sort == '9') {
				sort.time = -1;
			}else if (data.sort == '10') {
				sort.time = 1;


			}else{
				sort.profit = -1;
			}

			// count total
			Mini3Cay_users.aggregate([
				{$count: 'total'},
			]).exec(function(err, countFind){
				Mini3Cay_users.aggregate([
					{$project: {
						profit: {$subtract: ['$win', '$lost']},
						uid:    '$uid',
						bet:    '$bet',
						win:    '$win',
						lost:   '$lost',
						time:   '$time',
					}},
					{$sort: sort},
					{$skip: (page-1)*kmess},
					{$limit: kmess}
				]).exec(function(err, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							return new Promise(function(resolve, reject) {
								UserInfo.findOne({'id': obj.uid}, 'name', function(error, user){
									if (!!user) {
										obj['name'] = user.name;
									}
									Mini3Cay_red.findOne({'uid': obj.uid}, 'bet time', {sort:{'_id': -1}}, function(error, result2){
										delete obj._id;
										delete obj.uid;
										if (!!result2) {
											obj['t'] = result2.time;
											obj['b'] = result2.bet;
										}
										resolve(obj);
									})
								})
							})
						}))
						.then(function(data){
							client.red({mini3cay:{get_top:{data:data, page:page, kmess:kmess, total:countFind[0].total}}});
						})
					}else{
						client.red({mini3cay:{get_top:{data:[], page:1, kmess:9, total:0}}});
					}
				});
			});
		}
	}
}
