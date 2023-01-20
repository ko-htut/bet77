
let TaiXiu_User  = require('../../../Models/TaiXiu_user');
let TaiXiu_event = require('../../../Models/TaiXiu/TaiXiu_event');

let UserInfo     = require('../../../Models/UserInfo');

module.exports = function(client, date){
	var topWin  = TaiXiu_event.find({date: date, win: true}, {}, {sort:{'top':-1}}).exec();
	var topLost = TaiXiu_event.find({date: date, win: false}, {}, {sort:{'top':-1}}).exec();

	Promise.all([topWin, topLost])
	.then(result => {
		client.red({event:{taixiu:{topHQ:{win: result[0], lost: result[1]}}}});
	});
};
