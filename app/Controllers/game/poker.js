
const reg      = require('./poker/reg');    // đăng kí vào phòng
const ingame   = require('./poker/ingame'); // vào phòng

module.exports = function(client, data){
	if (!!data.reg) {
		reg(client, data.reg);
	}
	//if (!!data.ingame) {
		//ingame(client);
	//}
	//if (!!data.outgame && !!client.poker) {
	//	client.poker.outGame();
	//}
};
