
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:     {type: String, required: true, index: true}, // ID Người chơi
	red:     {type: Number, required: true}, // Red nạp
	xu:      {type: Number, required: true}, // Xu nhận được
	time:    Date,                           // Thời gian mua
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'MuaXu', field:'id'});
//Schema.index({uid: 1}, {background: true});

module.exports = mongoose.model('MuaXu', Schema);
