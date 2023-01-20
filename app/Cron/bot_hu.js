
let angrybird  = require('./bot_hu/angrybird');
let bigbabol   = require('./bot_hu/bigbabol');
let candy      = require('./bot_hu/candy');
let longlan    = require('./bot_hu/longlan');
let mini3cay   = require('./bot_hu/mini3cay');
let minipoker  = require('./bot_hu/minipoker');
let vqred      = require('./bot_hu/vqred');

module.exports = function(io, listBot){
	angrybird(io, listBot);
	bigbabol(io, listBot);
	candy(io, listBot);
	longlan(io, listBot);
	mini3cay(io, listBot);
	minipoker(io, listBot);
	vqred(io, listBot);

	listBot = null;
	io = null;
};
