
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	from:    {type: String, required: true}, // Tên người gửi
	to:      {type: String, required: true}, // Tên người nhận
	red:     {type: Number, required: true}, // Số red gửi
	red_c:   {type: Number, required: true}, // Số red nhận được
	message: String,                         // Thông điệp
	time:    Date,                           // Thời gian gửi
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'ChuyenRed', field:'id'});

module.exports = mongoose.model('ChuyenRed', Schema);
