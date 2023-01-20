
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	cart:    {type: String, required: true, index: true}, // ID giỏ hàng
	nhaMang: {type: String, required: true}, // Nhà mạng
	menhGia: {type: String, required: true}, // Mệnh giá
	maThe:   {type: String, default:  ''},   // Mã Thẻ
	seri:    {type: String, default:  ''},   // Seri
	time:    {type: String, default:  ''},   // Thời gian đến
});
//Schema.index({cart: 1}, {background: true});

module.exports = mongoose.model('MuaThe_card', Schema);
