
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:   {type: String, required: true, index: true},
	name:  {type: String, required: true},
	value: {type: String, required: true},
	type:  {type: Number},
});

module.exports = mongoose.model('TaiXiu_chat', Schema);
