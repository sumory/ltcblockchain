var sms = require('../lib/sms.js');

exports.send = function(req,res){
	var tel = req.body.tel;
	var msg = req.body.msg;

	if(msg.length > 63){
		res.json({
			success:true
		});
	}
	else{
		sms.sendSMS(tel,msg, function(e){
			res.json({
				success:e?false:true
			});
		});
	}
}