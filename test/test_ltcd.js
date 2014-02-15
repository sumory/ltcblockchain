var ltcd = require('../lib/ltcd.js');

function print(err, result) {
    console.log('\n');
    if (err) {
        console.error('发生错误', err);
    }
    else {
        console.dir(result);
    }
    console.log('\n');
}

/*
ltcd.request('getblockcount', [], function (err, result) {
    print(err, result);
});

ltcd.request('getblock', ['6c9816508d5560711fc363a486e3b7a9a3a6c8b7e32667dbc14bc8a159c884ee'], function (err, result) {
    print(err, result);
});


//获取一个交易的信息，第二个参数是0则返回编码过的，不是0返回正常json数据
ltcd.request('getrawtransaction', ['81acd61437b2aa729752ea54c990d5286fb8fb73872d599cd48dd9780bba2f9f', 1], function (err, result) {
    //print(err, result);
});

ltcd.request('getrawtransaction', ['d6fb653759cd54b0a119bcc20e1d61dec9618b448b34c936f990fcf1fe07d948', 1], function (err, result) {
    print(err, result);
    print(err, result.vin);
    print(err, result.vin[0].scriptSig);
    print(err, result.vout[0].scriptPubKey);//可以拿到这个output发到的地址
});




ltcd.request('getblock', ['57d3994e92203dc73d51e908a6520ebffb88a9e3f7ebc3c56dee4c931d40649e'], function (err, result) {
   // print(err, result);
});
ltcd.request('getrawtransaction', ['faec503c78080a06fb98ac841004206a3bb9452ec33d82d0bedf9e4954e16a88', 1], function (err, result) {
    print(err, result);
    print(err, result.vin);
    print(err, result.vin[0].scriptSig);
    print(err, result.vout[0].scriptPubKey);//可以拿到这个output发到的地址
});

 */
ltcd.request('getrawtransaction', ['97ddfbbae6be97fd6cdf3e7ca13232a3afff2353e29badfab7f73011edd4ced9', 0], function (err, result) {
     print(err, result);
});


ltcd.request('getbalance', [''], function (err, result) {
    print(err, result);
});