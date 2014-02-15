var check = require('validator').check;
var sanitize = require('validator').sanitize;
var helper = require('../lib/helper.js');
var config = require('../config.js');
var users = config.users;

/**
 * 登录系统
 */
exports.login = function(req, res, next) {
    if (req.session.user) {
        res.redirect('index');
        return;
    }

    var method = req.method.toLowerCase();
    if (method == 'get') {
        res.redirect('auth');
    } else if (method == 'post') {
        var username = sanitize(req.body.username).trim();
        var password = sanitize(req.body.password).trim();
        if (!username || !password) {
            res.render('auth', {
                error: '信息不完整',
                layout: false
            });
        } else {
            var user = undefined;
            for (var i in users) {
                var u = users[i];
                if (u.username === username && u.password === password) {
                    user = u;
                    break;
                }
            }
            if (user) {
                gen_session(user, req, res); // store session cookie
                res.redirect('index');
            } else {
                res.render('auth', {
                    error: '查无此用户',
                    layout: false
                });
            }
        };
    }
};

/**
 * 退出系统
 */
exports.logout = function(req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, {
        path: '/'
    });
    res.redirect('/');
};

/**
 * 写cookie
 */

function gen_session(user, req, res) {
    var auth_token = helper.encrypt(user.username + '\t' + user.password, config.session_secret);
    res.cookie(config.auth_cookie_name, auth_token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }); // cookie 有效期1周
    req.session.user = user;
}