
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:   {type: String, required: true, index: true}, // ID Người chơi
	title: {type: String},                  // Tiêu đề
	text:  {type: String},                  // Thông điệp
	read:  {type: Boolean, default: false}, // đã đọc?
	time:  {type: Date},                    // thời gian
});

module.exports = mongoose.model('Message', Schema);
