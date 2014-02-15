var request = require('request');
var helper = require('./helper.js');
var logger = require('./logger.js').logger('sms');

//使用时需要根据自己使用的sms服务对此函数进行修改
exports.sendSMS = function(telphone, msg, callback) {
    var content = escape(msg);
    var now = helper.now();

    var url = "http://si.800617.com:4400/SendSms.aspx?un=***&pwd=****&mobile=" + telphone + "&msg=" + content;
    request({
        url: url,
        method: "GET",
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: ""
    }, function(e, r, body) {
        if (!e) {
            logger.info(now + ' 短信已发出: ' + telphone + ' ' + msg, body);
            if(body.indexOf('=1')!=-1){
                logger.info(now + ' 短信发送成功');
                callback(null);
            }
            else{
                logger.error(now + ' 短信发送失败');
                callback(true);
            }
        } else {
            callback(e);
            logger.error(now + ' 短信发送失败: ' + telphone + ' ' + msg);
            logger.error(now + ' 短信发送失败Error: ', e);
        }
    });
};