
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	bank:   {type: String},               // Tên ngân hàng
	number: {type: String, unique: true}, // Số tài khoản
	name:   {type: String},               // Chủ tài khoản
	branch: {type: String},               // Chi nhánh
});

module.exports = mongoose.model('Bank', Schema);
