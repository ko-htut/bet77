
const Message = require('../../Models/Message');

module.exports = function(client, id){
	Message.findOne({'_id': id}, 'text read', function(err, data){
		if (!!data) {
			data.read = true;
			data.save();
			client.red({message:{text:data.text}});
		}
	});
}
