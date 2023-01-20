
var CaoThap_red = require('../../../Models/CaoThap/CaoThap_redbuoc');
var CaoThap_xu  = require('../../../Models/CaoThap/CaoThap_xubuoc');

module.exports = function(client, data){
	if (!!data && !!data.page) {
		var red  = !!data.red;
		var page = data.page>>0;
		if (page < 1) {
			client.red({notice:{text: 'DỮ LIỆU KHÔNG ĐÚNG...', title: 'THẤT BẠI'}});
		}else{
			var kmess = 8;
			if (red) {
				CaoThap_red.countDocuments({uid: client.UID}).exec(function(err, total){
					CaoThap_red.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								obj = obj._doc;
								delete obj.__v;
								delete obj._id;
								return obj;
							}))
							.then(function(arrayOfResults) {
								client.red({mini:{caothap:{history:{data:arrayOfResults, page:page, kmess:kmess, total:total}}}});
							})
						}else{
							client.red({mini:{caothap:{history:{data:[], page:page, kmess:kmess, total:0}}}});
						}
					});
				})
			}else{
				CaoThap_xu.countDocuments({uid: client.UID}).exec(function(err, total){
					CaoThap_xu.find({uid: client.UID}, {}, {sort:{'_id':-1}, skip: (page-1)*kmess, limit: kmess}, function(err, result) {
						if (result.length) {
							Promise.all(result.map(function(obj){
								obj = obj._doc;
								delete obj.__v;
								delete obj._id;
								return obj;
							}))
							.then(function(arrayOfResults) {
								client.red({mini:{caothap:{history:{data:arrayOfResults, page:page, kmess:kmess, total:total}}}});
							})
						}else{
							client.red({mini:{caothap:{history:{data:[], page:page, kmess:kmess, total:0}}}});
						}
					});
				})
			}
		}
	}
}
