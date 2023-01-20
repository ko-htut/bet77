
const UserInfo = require('../../../../Models/UserInfo');
const HU       = require('../../../../Models/HU');

module.exports = function(client, data) {
	if (!!data && !!data.name && !!data.bet) {
		var name = ''+data.name+'';
		var bet  = data.bet;
		name = name.toLowerCase();

		UserInfo.findOne({name:name}, 'name', function(err, data){
			if (!!data) {
				HU.updateOne({game: 'long', type:bet, red:true}, {$set:{name:name}}).exec();
				client.red({longlan:{name_hu:{bet:bet, name:name}}, notice:{title:'LONG LÂN',text:'Hũ ' + bet + ' sẽ được kích nổ bởi ' + data.name + '...'}});
			}else{
				client.red({notice:{title:'THẤT BẠI',text:'Người dùng không tồn tại...'}});
			}
		})
	}
}
