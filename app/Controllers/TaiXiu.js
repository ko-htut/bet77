
var TaiXiu     = require('./taixiu/index.js');
var getLogChat = require('./taixiu/getLogChat');

module.exports = function(client, data){
	if (void 0 !== data.view) {
		client.gameEvent.viewTaiXiu = !!data.view;
	}
	if (!!data.getLogs) {
		TaiXiu.getLogs(client);
	}
	if (!!data.cuoc) {
		TaiXiu.cuoc(client, data.cuoc);
	}
	if (!!data.chat) {
		TaiXiu.chat(client, data.chat);
	}
	if (!!data.get_phien) {
		TaiXiu.get_phien(client, data.get_phien);
	}
	if (!!data.get_log) {
		TaiXiu.get_log(client, data.get_log);
	}
	if (!!data.get_top) {
		TaiXiu.get_top(client, data.get_top);
	}
	if (!!data.get_new) {
		TaiXiu.getNew(client);
	}
	if (!!data.getLogChat) {
		getLogChat(client);
	}
}
