
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	name: {type: String, required: true, index: true},
	type: {type: Number, default: 0},         // Loại được ăn lớn nhất trong phiên
	win:  {type: Number, default: 0},         // Tiền thắng
	bet:  {type: Number, default: 0},         // Mức cược
	time: {type: Date,   default: new Date()},
});

Schema.plugin(AutoIncrement.plugin, {modelName:'AngryBirds_xu', field:'id'});
//Schema.index({name: 1}, {background: true});

module.exports = mongoose.model('AngryBirds_xu', Schema);
