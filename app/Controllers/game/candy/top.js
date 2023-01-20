
var Candy_red = require('../../../Models/Candy/Candy_red');
var Candy_xu  = require('../../../Models/Candy/Candy_xu');

var UserInfo  = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		Candy_red.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({candy:{top:arrayOfResults}});
			})
		});
	}else{
		Candy_xu.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({candy:{top:arrayOfResults}});
			})
		});
	}
};
