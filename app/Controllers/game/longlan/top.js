
var LongLan_red = require('../../../Models/LongLan/LongLan_red');
var LongLan_xu  = require('../../../Models/LongLan/LongLan_xu');

var UserInfo  = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		LongLan_red.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 100}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({longlan:{top:arrayOfResults}});
			})
		});
	}else{
		LongLan_xu.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 100}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({longlan:{top:arrayOfResults}});
			})
		});
	}
};
