
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	uid:       {type: String,  required: true},    // ID Người cược
	name:      {type: String,  required: true},    // Name Người cược
	phien:     {type: Number,  required: true, index: true},    // phiên cược
	bet:       {type: Number,  required: true},    // số tiền cược
	red:       {type: Boolean, required: true},    // loại tiền (Red        = true, Xu       = false)
	taixiu:    {type: Boolean, required: true},    // loại game (tài xỉu    = true, chẵn nẻ  = false)
	select:    {type: Boolean, required: true},    // bên cược  (Tài = Chẵn = true, Xỉu = Lẻ = false)
	tralai:    {type: Number,  default: 0},        // Số tiền trả lại
	thanhtoan: {type: Boolean, default: false},    // tình trạng thanh toán
	win:       {type: Boolean, default: false},	   // Thắng hoặc thua
	betwin:    {type: Number,  default: 0},	       // Tiền thắng được
	time:      {type: Date},                       // thời gian cược
});

Schema.index({uid:1, thanhtoan:1}, {background: true});

// Schema.index({uid:1, thanhtoan:1, taixiu:1, red:1}, {background: true});

Schema.index({phien:1, taixiu:1, red:1}, {background: true});

module.exports = mongoose.model('TaiXiu_cuoc', Schema);
