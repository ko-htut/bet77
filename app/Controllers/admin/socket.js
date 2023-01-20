const Admin  = require('./Admin')
const onPost = require('./onPost')

function auth(client) {
	client.gameEvent = {};
	Admin.first(client)
}

module.exports = {
	auth: auth,
	message: onPost,
};