
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenhGiaSchema = new Schema({
	name:   {type: String,  required: true}, // mệnh giá
	values: {type: Number,  required: true}, // giá trị Red
	nap:    {type: Boolean, default: false}, // Áp dụng cho nạp Red
	mua:    {type: Boolean, default: false}, // Áp dụng cho mua thẻ nạp
});

module.exports = mongoose.model('MenhGia', MenhGiaSchema);
