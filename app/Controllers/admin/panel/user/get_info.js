
var Users_TX           = require('../../../../Models/TaiXiu_user');
var Users_BauCua       = require('../../../../Models/BauCua/BauCua_user');
var Users_BigBabol     = require('../../../../Models/BigBabol/BigBabol_users');
var Users_CaoThap      = require('../../../../Models/CaoThap/CaoThap_user');
var Users_Mini3Cay     = require('../../../../Models/Mini3Cay/Mini3Cay_user');
var Users_miniPoker    = require('../../../../Models/miniPoker/miniPoker_users');
var Users_VuongQuocRed = require('../../../../Models/VuongQuocRed/VuongQuocRed_users');
var Users_AngryBirds   = require('../../../../Models/AngryBirds/AngryBirds_user');
var Users_LongLan      = require('../../../../Models/LongLan/LongLan_user');
var Users_Candy        = require('../../../../Models/Candy/Candy_user');

var Users    = require('../../../../Models/Users');
var UserInfo = require('../../../../Models/UserInfo');
let Phone    = require('../../../../Models/Phone');


module.exports = function(client, id){
	if (!!id) {
		var wait_user = new Promise((resolve, reject)=>{
			UserInfo.findOne({'id': id}, function(err, result) {
				if (!!result) {
					Users.findOne({'_id': result.id}, function(error, result2){
						var temp = result._doc
						delete temp._id;
						delete temp.__v;
						temp['username'] = !!result2 ? result2.local.username : '';
						Phone.findOne({'uid': result.id}, function(error2, result3){
							temp['phone'] = !!result3 ? result3.region+result3.phone : '';
							resolve(temp)
						});
					})
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_TX = new Promise((resolve, reject)=>{
			Users_TX.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_BauCua = new Promise((resolve, reject)=>{
			Users_BauCua.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_BigBabol = new Promise((resolve, reject)=>{
			Users_BigBabol.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});
		var wait_CaoThap = new Promise((resolve, reject)=>{
			Users_CaoThap.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});
		var wait_Mini3Cay = new Promise((resolve, reject)=>{
			Users_Mini3Cay.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});
		var wait_miniPoker = new Promise((resolve, reject)=>{
			Users_miniPoker.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_VuongQuocRed = new Promise((resolve, reject)=>{
			Users_VuongQuocRed.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_AngryBirds = new Promise((resolve, reject)=>{
			Users_AngryBirds.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_LongLan = new Promise((resolve, reject)=>{
			Users_LongLan.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_Candy = new Promise((resolve, reject)=>{
			Users_Candy.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var active = [wait_user, wait_TX, wait_BauCua, wait_BigBabol, wait_CaoThap, wait_Mini3Cay, wait_miniPoker, wait_VuongQuocRed, wait_AngryBirds, wait_LongLan, wait_Candy];
		Promise.all(active).then(resulf => {
			client.red({users:{get_info:{
				profile:   resulf[0],
				taixiu:    resulf[1],
				baucua:    resulf[2],
				bigbabol:  resulf[3],
				caothap:   resulf[4],
				mini3cay:  resulf[5],
				minipoker: resulf[6],
				vqred:     resulf[7],
				angrybird: resulf[8],
				longlan:   resulf[9],
				candy:     resulf[10],
			}}});
		});
	}
}
