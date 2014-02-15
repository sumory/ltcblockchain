var http = require('http');
var path = require('path');
var express = require('express');
var partials = require('express-partials');

var helper = require('./lib/helper.js');
var config = require('./config.js');
var routes = require('./routes.js');

var app = express();

app.locals({
    helper: helper,
    title:'abc'
});
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(partials());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.auth_cookie_name)); //req.signedCookies
app.use(express.session());
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        res.locals.current_user = req.session.user;
        
    }
    next();
});
app.use(app.router);
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) { //用来纪录诸如err, log, 或者类似服务的错误信息
    console.log('--->logErrors', helper.now());
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) { //注意错误非常明确的向后传递
    console.log('--->clientErrorHandler', helper.now());
    if (req.xhr) {
        res.send(500, {
            error: 'Something blew up!'
        });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) { //"捕获所有" 的异常
    console.log('--->errorHandler', helper.now(), err);
    res.status(500);
    res.render('error', {
        error: '服务器发生错误',
        layout:false
    });
}


routes(app); // load routes

http.createServer(app).listen(app.get('port'), function() {
    console.log('ltcblockchain server listening on port ' + app.get('port'));
});
