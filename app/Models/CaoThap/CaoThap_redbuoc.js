
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:   {type: String,  required: true, index: true},      // ID Người chơi
	id:    {type: Number,  default: 0},          // Phiên
	cuoc:  {type: Number,  default: 0},          // Tiền cược
	bet:   {type: Number,  default: 0},          // Tiền thắng
	buoc:  {type: Number,  default: 0},          // bước chơi hiện tại
	chon:  {type: Number,  default: 0},          // Chọn Cao 2 / Thấp 1 (0 Không chọn)
	card1: {},                                   // Kết quả trước
	card2: {},                                   // Kết quả sau
	time:  {type: Date,    default: new Date()}, // Thời gian chọn
});
//Schema.index({uid: 1}, {background: true});

module.exports = mongoose.model('CaoThap_redbuoc', Schema);

