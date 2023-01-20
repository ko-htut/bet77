
var AngryBirds_red = require('../../../Models/AngryBirds/AngryBirds_red');
var AngryBirds_xu  = require('../../../Models/AngryBirds/AngryBirds_xu');

module.exports = function(client, data){
	var red    = !!data;   // Loại tiền (Red: true, Xu: false)
	if (red) {
		AngryBirds_red.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{arb:{top:arrayOfResults}}});
			})
		});
	}else{
		AngryBirds_xu.find({type:{$gte:1}}, 'name win bet time type', {sort:{'_id':-1}, limit: 50}, function(err, result) {
			Promise.all(result.map(function(obj){
				obj = obj._doc;
				delete obj.__v;
				delete obj._id;
				return obj;
			}))
			.then(function(arrayOfResults) {
				client.red({mini:{arb:{top:arrayOfResults}}});
			})
		});
	}
};
