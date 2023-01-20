
var VuongQuocRed_red = require('../../../Models/VuongQuocRed/VuongQuocRed_red');
var VuongQuocRed_xu  = require('../../../Models/VuongQuocRed/VuongQuocRed_xu');

var UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		VuongQuocRed_red.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({VuongQuocRed:{top:arrayOfResults}});
			})
		});
	}else{
		VuongQuocRed_xu.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({VuongQuocRed:{top:arrayOfResults}});
			})
		});
	}
};
