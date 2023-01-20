
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	room:   {type: Number, required: true, index: true}, // phòng (100, 1000, ...)
	online: {type: Number, default: 0},     // Số người chơi
});

Schema.plugin(AutoIncrement.plugin, {modelName:'Poker_red', field:'id'});
//Schema.index({room: 1}, {background: true});

module.exports = mongoose.model('Poker_red', Schema);
