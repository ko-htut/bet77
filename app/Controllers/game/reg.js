
let XocXoc = require('./XocXoc/reg');

module.exports = function(client, game){
	switch(game) {
	  	case 'XocXoc':
	    	XocXoc(client);
	   	break;
	}

	client = null;
	game = null;
};
