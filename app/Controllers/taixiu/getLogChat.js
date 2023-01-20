
var TXChat  = require('../../Models/TaiXiu_chat');

module.exports = function(client){
	TXChat.find({},'name value', {sort:{'_id':-1}, limit: 20}, function(err, post) {
		if (post.length){
			Promise.all(post.map(function(obj){return {'user':obj.name, 'value':obj.value}}))
			.then(function(arrayOfResults) {
				client.red({taixiu:{chat:{logs: arrayOfResults.reverse()}}});
			})
		}
	});
}
