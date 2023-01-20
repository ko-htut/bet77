
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NhaMangSchema = new Schema({
	name:  {type: String,  required: true}, // Tên nhà mạng
	value: {type: String,  required: true}, // Tên nhà mạng
	nap:   {type: Boolean, default: false}, // Áp dụng cho nạp Red
	mua:   {type: Boolean, default: false}, // Áp dụng cho mua thẻ nạp
});

module.exports = mongoose.model('NhaMang', NhaMangSchema);
