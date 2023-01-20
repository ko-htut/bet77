
let messages = require('./messages');

module.exports = function(bot) {
	bot.on('message', (msg) => {
		messages(bot, msg);
	});
}
