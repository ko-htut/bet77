
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid:     {type: String, required: true, index: true}, // ID người chơi
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: Number, required: true}, // Mệnh giá
	soLuong: {type: Number, required: true}, // Số lượng
	Cost:    {type: Number, required: true}, // Chi Phí
	status:  {type: Number, default:  0, index: true},    // Trạng thái mua
	time:    Date,                           // Thời gian mua
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'MuaThe', field:'GD'});
//Schema.index({status: 1}, {background: true});

module.exports = mongoose.model('MuaThe', Schema);
