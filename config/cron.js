
let CronJob = require('cron').CronJob;

let CronHu  = require('../app/Cron/EventHu');

module.exports = function() {
	new CronJob('0 0 0 * * *', function() {
		CronHu();
	}, null, true, 'Asia/Ho_Chi_Minh');
}
