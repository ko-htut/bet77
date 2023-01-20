
module.exports = function(client){
	client.red({
		taixiu: {time_remain: client.redT.TaiXiu_time},
		mini:   {baucua:{time_remain: client.redT.BauCua_time}}
	});
}
