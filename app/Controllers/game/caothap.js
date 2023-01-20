
const play      = require('./caothap/play');
const history   = require('./caothap/history');
const tops      = require('./caothap/tops');
//
module.exports = function(client, data){
	if (!!data.play) {
		play(client, data.play)
	}
	if (!!data.history) {
		history(client, data.history)
	}
	if (void 0 !== data.tops) {
		tops(client, data.tops)
	}
};
