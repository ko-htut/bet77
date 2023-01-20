
module.exports = function(client){
	let xocxoc = client.redT.game.xocxoc;
	if (xocxoc.clients[client.UID] === client) {
		delete xocxoc.clients[client.UID];

		let clients = Object.keys(xocxoc.clients).length;
		Object.values(xocxoc.clients).forEach(function(users){
			if (client !== users) {
				users.red({xocxoc:{ingame:{client:clients}}});
			}
		});
	}
	xocxoc = null;
	client = null;
};
