
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:    {type: String, index: true},              // Người Nạp gift code
	create: {type: String},                           // Người Tạo Mã gift (Chỉ người dùng)
	code:   {type: String, unique:  true},            // Mã Gift code
	red:    {type: Number, default: 0},               // Giá trị Red
	xu:     {type: Number, default: 0},               // Giá trị Xu
	type:   {type: String, default: '', index: true}, // Mã chung của họ gift code (Người dùng chỉ được sử dụng tối đa 1 thẻ gift trong họ gift cùng loại)
    date:   {type: Date,   default: new Date()},      // Ngày tạo
    todate: {type: Date},                             // Ngày hết hạn (Thẻ gift có giá trị đến hết 24H trong ngày hết hạn)
    to:     {type: String},                           // Đến người dùng (chỉ họ mới đc nhận)
});

Schema.index({uid:1, type:1}, {background: true});
module.exports = mongoose.model('GiftCode', Schema);
