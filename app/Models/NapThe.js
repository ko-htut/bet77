
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:     {type: String, required: true, index: true}, // ID người chơi
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: Number, required: true}, // Mệnh giá
	nhan:    {type: Number, default: 0},     // Nhận
	maThe:   {type: String, required: true}, // Mã Thẻ
	seri:    {type: String, required: true}, // Seri
	status:  {type: Number, default: 0, index: true}, // Trạng thái nạp (0: chờ, 1: Thành công, 2:Thất bại)
	time:    Date,                           // Thời gian nạp
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'NapThe', field:'GD'});
//Schema.index({uid: 1}, {background: true});

module.exports = mongoose.model('NapThe', Schema);
