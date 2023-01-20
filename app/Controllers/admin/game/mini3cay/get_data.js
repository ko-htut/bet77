
const HU = require('../../../../Models/HU');

module.exports = function(client) {
	HU.find({game: 'mini3cay', red:true}, 'name type redPlay redWin redLost hu', function(err, cat){
		Promise.all(cat.map(function(obj){
			obj = obj._doc;
			delete obj._id;
			return obj;
		}))
		.then(varT => {
			client.red({mini3cay:{hu:varT}});
		})
	});
}
