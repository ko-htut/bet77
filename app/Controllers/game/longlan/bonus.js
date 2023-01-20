
const HU            = require('../../../Models/HU');

const LongLan_red  = require('../../../Models/LongLan/LongLan_red');
const LongLan_xu   = require('../../../Models/LongLan/LongLan_xu');
const LongLan_user = require('../../../Models/LongLan/LongLan_user');

const UserInfo   = require('../../../Models/UserInfo');

function onSelectBox(client, box){
	box = box>>0;
	if (void 0 !== client.LongLan &&
		client.LongLan.bonus !== null &&
		client.LongLan.bonusL > 0)
	{
		var index = box-1;
		if (void 0 !== client.LongLan.bonus[index]) {
			if (!client.LongLan.bonus[index].isOpen) {
				client.LongLan.bonusL -= 1;
				client.LongLan.bonus[index].isOpen = true;

				var bet = client.LongLan.bonus[index].bet;
				client.LongLan.bonusWin += bet;
				client.red({longlan:{bonus:{bonus: client.LongLan.bonusL, box: index, bet: bet}}});
				if (!client.LongLan.bonusL) {
					var betWin = client.LongLan.bonusWin;

					var uInfo    = {};
					var gInfo    = {};
					var huUpdate = {};

					if (client.LongLan.red) {
						huUpdate.redWin = betWin;
						uInfo.red       = betWin;
						uInfo.redWin    = betWin;
						gInfo.win       = betWin;
						LongLan_red.updateOne({'_id': client.LongLan.id}, {$inc:{win:betWin}}).exec();
					}else{
						huUpdate.xuWin = betWin;
						uInfo.xu       = betWin;
						uInfo.xuWin    = betWin;
						gInfo.winXu    = betWin;

						var thuong = (betWin*0.039589)>>0;
						uInfo.red      = thuong;
						uInfo.thuong   = thuong;
						gInfo.thuong   = thuong;

						LongLan_xu.updateOne({'_id': client.LongLan.id}, {$inc:{win:betWin}}).exec();
					}

					client.LongLan.bonus    = null;
					client.LongLan.bonusWin = 0;

					UserInfo.findOneAndUpdate({id:client.UID}, {$inc:uInfo}, function(err, user){
						setTimeout(function(){
							if (client.LongLan.red) {
								client.red({longlan:{bonus:{win: betWin}}, user:{red:user.red*1+betWin}});
							}else{
								client.red({longlan:{bonus:{win: betWin}}, user:{xu:user.xu*1+betWin}});
							}
						}, 700);
					});
					HU.updateOne({game:'long', type:client.LongLan.bet, red:client.LongLan.red}, {$inc:huUpdate}).exec();
					LongLan_user.updateOne({'uid':client.UID}, {$inc:gInfo}).exec();
				}
			}
		}
	}
}

module.exports = function(client, data){
	if (void 0 !== data.box) {
		onSelectBox(client, data.box);
	}
};
