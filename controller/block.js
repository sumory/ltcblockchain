var async = require('async');
var ltcd = require('../lib/ltcd.js');
var helper = require('../lib/helper.js');


exports.get = function (req, res) {
    async.waterfall([function (callback) {
        ltcd.getblock(req.params.hash, function (err, block) {
            if (err) {
                callback(err);
            }
            callback(null, block);
        });
    }, function (block, callback) {
        var height = block.height;
        var prev_height = height - 1;
        var next_height = height + 1;
        var b = {
            prev_block:null,
            current_block:null,
            next_block:null
        };
        b.current_block = block;
        async.parallel({prev_block:function (cb) {
            ltcd.getblockByHeight(prev_height, function (err, block) {
                if (err) {
                    cb(err);
                }
                cb(null, block);
            });
        }, next_block:function (cb) {
            ltcd.getblockByHeight(next_height, function (err, block) {
                if (err) {
                    cb(err);
                }
                cb(null, block);
            });
        }}, function (err, blocks) {
            b.prev_block = blocks.prev_block;
            b.next_block = blocks.next_block;
            callback(err, b);
        });
    }], function (err, result) {
        if (err) {
            res.render('error', {error:err});
        }
        else {
            res.render('block', {
                prev_block:result.prev_block,
                block:result.current_block,
                next_block:result.next_block
            });
        }
    });
};


exports.getBlock = function (req, res) {

    async.waterfall([function (callback) {//获取块
        ltcd.getblock(req.params.hash, function (err, block) {
            if (err) {
                callback(err);
            }
            callback(null, block);
        });
    }, function (block, callback) {//获取块下的交易详细信息
        var b = {
            block:block,
            txes:null
        };
        var txids = block.tx;//交易id数组
        var func_array = [];//用于获取交易细节的函数数组
        txids.forEach(function(txid,index){
           func_array.push(function(cb){
               ltcd.gettx(txid, 1, function (err, tx) {
                   if(err || !tx) {
                       tx = {
                           query:false,//没有查到结果，可能litecoind有问题
                           txid:txid
                       };
                       cb(null, tx);
                   }
                   else{
                       tx = tx || {};
                       tx.query = true;
                       cb(null,tx);
                   }
               });
           });
        });

        async.series(func_array, function (err, txes) {
            b.txes=txes;
            console.log('-------------------------', b.txes.length);
            callback(err, b);
        });

    }], function (err, result) {
        if (err) {
            res.render('error', {error:err});
        }
        else {
            var txes = result.txes;
            var generated = 0;
            if(txes && txes[0]){
                var coninbase = txes[0];
                for(var k=0;k<coninbase.vout.length;k++){
                    var out_detail = coninbase.vout[k];
                    if(out_detail){
                        generated +=  parseFloat(out_detail.value);
                    }
                }
            }
            res.render('block', {
                block:result.block,
                txes:txes,
                generated: helper.trimRightChar(generated.toFixed(8)+'', '0')
            });
        }
    });
};


exports.getTx = function(req, res) {
    var txid = req.params.txid;
    ltcd.gettx(txid, 1, function (err, tx) {
        if(err || !tx) {
            tx = {
                query:false,//没有查到结果，可能litecoind有问题
                txid:txid
            };
        }
        else{
            tx = tx || {};
            tx.query = true;
        }
        res.render('tx', {
            tx:tx
        });
    });
};

exports.getAddress = function(req, res){};