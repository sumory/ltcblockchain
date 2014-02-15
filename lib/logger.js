var log4js = require('log4js');

//console log is loaded by default, so you won't normally need to do this
//log4js.loadAppender('console');
log4js.loadAppender('file');


log4js.configure({
	appenders: [{
		type: 'console'
	}, {
		type: 'file',
		filename: 'logs/common.log',
		category: 'common'
	}],
	replaceConsole: true
});

var loggers = {
	'common': log4js.getLogger('common')
};

/*
var logger = log4js.getLogger('common');
logger.setLevel('INFO');

logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
*/

exports.logger = function(name, level) {
	var logger;

	if (loggers[name]) {
		logger = loggers[name];
	} else {
		log4js.addAppender(log4js.appenders.file('logs/' + name + '.log'), name);
		logger = log4js.getLogger(name);
		loggers[name] = logger;
	}

	if (level) {
		logger.setLevel(level);
	}

	return logger;
}