/******************************************
 * 莱特币钱包api
 * 1. getblock
 * 2. gettrasaction
 ******************************************/
var Litecoin = require('node-litecoin-custom');

var litecoind = new Litecoin({
    host:'localhost',
    port:9332,
    user:'litecoinrpc',
    pass:'9tEhoNGF7BJxXvhQr3tRZwivskvJBtLmLrP2GQQT7nNU'
});

exports.request = function (method, params, callback) {
    litecoind.request(method, params, callback);
};

exports.getblock = function (blockhash, callback) {
    litecoind.request('getblock', [blockhash], callback);
};

exports.getblockByHeight = function (height, callback) {
    litecoind.request('getblockhash', [height], function (err, blockhash) {
        if (err) {
            callback(err);
        }
        else {
            litecoind.request('getblock', [blockhash], callback);
        }
    });
};


exports.gettx = function (txhash, verbose, callback) {
    litecoind.request('getrawtransaction', [txhash, verbose], callback);
};

