
let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	id:         {type: String, required: true, unique: true}, // ID đăng nhập
	name:       {type: String, required: true, unique: true}, // Tên nhân vật
	avatar:     {type: String, default: ''},       // Tên avatar
	joinedOn:   {type: Date, default: new Date()}, // Ngày tham gia

	email:      {type: String, default: ''}, // EMail
	cmt:        {type: String, default: ''}, // CMT

	security:   {                            // Bảo Mật
		login:   {type: Number, default: 0}, // Bảo mật đăng nhập
	},

	red:        {type: mongoose.Schema.Types.Long, default: 0},     // RED
	ketSat:     {type: mongoose.Schema.Types.Long, default: 0},     // RED trong két sắt
	xu:         {type: mongoose.Schema.Types.Long, default: 0},     // XU

	redWin:     {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Red thắng
	redLost:    {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Red thua
	redPlay:    {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Red đã chơi

	xuWin:      {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Xu thắng
	xuLost:     {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Xu thua
	xuPlay:     {type: mongoose.Schema.Types.Long, default: 0},     // Tổng Xu đã chơi
	thuong:     {type: mongoose.Schema.Types.Long, default: 0},     // RED thưởng khi chơi XU

	vip:        {type: Number, default: 0},                         // Tổng vip tích luỹ (Vip đã đổi thưởng)
	lastVip:    {type: mongoose.Schema.Types.Long, default: 0},     // Cập nhật lần đổi thưởng cuối

	hu:         {type: Number, default: 0},                         // Số lần Nổ Hũ REd
	huXu:       {type: Number, default: 0},                         // Số lần Nổ Hũ Xu

	type:       {type: Boolean, default: false, index: true},       // Bot = true | Users = false

	otpFirst:   {type: Boolean, default: false},                    // Kiểm tra lần đầu lấy mã OTP
});

Schema.plugin(AutoIncrement.plugin, {modelName: 'UserInfo', field:'UID'});

module.exports = mongoose.model('UserInfo', Schema);
