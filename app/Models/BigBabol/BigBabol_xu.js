
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const mongoose      = require('mongoose');

const Schema = new mongoose.Schema({
	name: {type: String, required: true, index: true},
	type: {type: Number, default: 0},         // Loại được ăn lớn nhất trong phiên
	win:  {type: Number, default: 0},         // Tiền thắng
	bet:  {type: Number, default: 0},         // Mức cược
	line: {type: Number, default: 0},         // Số dòng chọn
	kq:   {type: Number, default: 0},         // Số dòng ăn
	time: {type: Date,   default: new Date()},
});

Schema.plugin(AutoIncrement.plugin, {modelName:'BigBabol_xu', field:'id'});
//Schema.index({name: 1}, {background: true});

module.exports = mongoose.model('BigBabol_xu', Schema);
