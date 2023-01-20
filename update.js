
let UserInfo    = require('./app/Models/UserInfo');
let MegaJP_user = require('./app/Models/MegaJP/MegaJP_user');

module.exports = function(){
	//MegaJP_user.deleteMany({}).exec();
	/**

	UserInfo.find({}, 'id', function(err, users){
		users.forEach(function(user){
			MegaJP_user.findOne({uid:user.id}, {}, function(err2, dataP){
				if (!dataP) {
					MegaJP_user.create({'uid':user.id});
				}
			});
		});
	});

	MegaJP_user.find({}, 'uid', function(err, users){
		users.forEach(function(user){
			UserInfo.findOne({id:user.uid}, '_id', function(err2, dataP){
				if (!dataP) {
					user.remove();
				}
			});
		});
	});
	*/
}
