
var Bank   = require('../../../Models/Bank/Bank');

module.exports = function(client){
	Bank.find({}, function(err, list){
		Promise.all(list.map(function(obj){
			obj = obj._doc;
			delete obj._id;
			delete obj.__v;
			return obj;
		}))
		.then(result => {
			client.red({shop:{bank:{list:result}}});
		})
	});
}
