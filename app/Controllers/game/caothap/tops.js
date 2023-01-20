
const CaoThap_red = require('../../../Models/CaoThap/CaoThap_red');
const CaoThap_xu  = require('../../../Models/CaoThap/CaoThap_xu');

const UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		CaoThap_red.find({play: false, $or:[
			{goc:1000, bet:{$gt:1000}},
			{goc:10000, bet:{$gt:10000}},
			{goc:50000, bet:{$gt:50000}},
			{goc:100000, bet:{$gt:100000}},
			{goc:500000, bet:{$gt:500000}}
		]}, 'uid goc bet a time', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				obj.a = (obj.a.length == 3);
				var getPhien = UserInfo.findOne({id: obj.uid}, 'name').exec();
				return Promise.all([getPhien]).then(values => {
					Object.assign(obj, values[0]._doc);
					delete obj.__v;
					delete obj._id;
					delete obj.uid;
					return obj;
				});
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{caothap:{tops:arrayOfResults}}});
			})
		});
	}else{
		CaoThap_xu.find({play: false, $or:[
			{goc:1000, bet:{$gt:1000}},
			{goc:10000, bet:{$gt:10000}},
			{goc:50000, bet:{$gt:50000}},
			{goc:100000, bet:{$gt:100000}},
			{goc:500000, bet:{$gt:500000}}
		]}, 'uid goc bet a time', {sort:{'_id':-1}, limit: 50}, function(err, result) {
				Promise.all(result.map(function(obj){
					obj = obj._doc;
					obj.a = (obj.a.length == 3);
					var getPhien = UserInfo.findOne({id: obj.uid}, 'name').exec();
					return Promise.all([getPhien]).then(values => {
						Object.assign(obj, values[0]._doc);
						delete obj.__v;
						delete obj._id;
						delete obj.uid;
						return obj;
					});
				}))
				.then(function(arrayOfResults) {
					client.red({mini:{caothap:{tops:arrayOfResults}}});
				})
		});
	}
};
