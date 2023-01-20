
/**
 * Mini Game
 */
// Mini Poker
let mini_poker = require('./game/mini_poker');

// Big Babol
let big_babol  = require('./game/big_babol');


// Bầu Cua
let baucua     = require('./game/baucua');

// Mini 3 Cây
let mini3cay   = require('./game/mini3cay');

// Cao Thấp
let caothap    = require('./game/caothap');

// AngryBirds
let angrybird  = require('./game/angrybird');

let megaj      = require('./game/megaj');


/**
 * Game
 */
// Vương Quốc Red
let vq_red  = require('./game/vuong_quoc_red');

// Candy
let Candy   = require('./game/candy');

// Poker
let Poker   = require('./game/poker');

// Long Lân
let LongLan = require('./game/longlan');

// Reg game
let reg     = require('./game/reg');


// Xoc Xoc
let XocXoc  = require('./game/XocXoc');

// Xo So
let xs      = require('./game/xs');

module.exports = function(client, data){
	if (!!data.mini_poker) {
		mini_poker(client, data.mini_poker);
	}
	if (!!data.big_babol) {
		big_babol(client, data.big_babol);
	}
	if (!!data.vq_red) {
		vq_red(client, data.vq_red);
	}
	if (!!data.baucua) {
		baucua(client, data.baucua);
	}
	if (!!data.mini3cay) {
		mini3cay(client, data.mini3cay);
	}
	if (!!data.caothap) {
		caothap(client, data.caothap);
	}
	if (!!data.angrybird) {
		angrybird(client, data.angrybird);
	}
	if (!!data.megaj) {
		megaj(client, data.megaj);
	}


	if (!!data.poker) {
		Poker(client, data.poker);
	}

	if (!!data.candy) {
		Candy(client, data.candy);
	}

	if (!!data.longlan) {
		LongLan(client, data.longlan);
	}

	if (!!data.reg) {
		reg(client, data.reg);
	}

	if (!!data.xocxoc) {
		XocXoc(client, data.xocxoc);
	}

	if (!!data.xs) {
		xs(client, data.xs);
	}

	client = null;
	data = null;
}
