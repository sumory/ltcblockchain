var index_ctrl = require('./controller/index.js');
var auth_ctrl = require('./controller/auth.js');
var block_ctrl = require('./controller/block.js');

module.exports = function (app) {
    app.get('/', function (req, res, next) {
        res.render('index', {});
    });

    app.post('/searchblock', function (req, res) {
        var block_hash = req.body.search;
        res.redirect('block/' + block_hash);
    });

    app.post('/searchaddress', function (req, res) {
        var address = req.body.search;
        res.redirect('address/' + address);
    });

    app.post('/searchtx', function (req, res) {
        var txid = req.body.search;
        res.redirect('tx/' + txid);
    });

    app.get('/block/:hash', block_ctrl.getBlock);
    app.get('/tx/:txid', block_ctrl.getTx);
    app.get('/address/:address', block_ctrl.getAddress);
};


/**
 * 判断用户是否登录，是则进行下一步操作，否则跳转错误页面
 */
function requireAuthentication(req, res, next) {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        next();
    }
    else {
        res.render('auth', {
            error:'请先登录',
            layout:false
        });
    }
}