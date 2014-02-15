var math = require('mathjs');


/**
 * 在某一难度和算力（单位是字节）下，计算每出一个块耗时
 * @param difficulty
 * @param hashrate 单位字节
 * @return
 */

function getTimePerBlock(diff, hashrate) {
	var baseData = Math.pow(2, 208);
	for (var i = 209; i <= 223; i++) {
		var step = Math.pow(2, i);
		baseData = baseData + step;
	}
	//console.log(baseData);

	var multiply = math.select(baseData).divide(diff).multiply(hashrate).done();
	var pow = Math.pow(2, 256);
	var timePerBlock = math.select(pow).divide(multiply).done();
	console.log(timePerBlock);
	return timePerBlock;
}


/**
 * 给定难度变化、开始时间和结束时间，计算收益
 * @param difficultyList 按时间升序排列
 * @param sinceTime 计算起始日期，秒
 * @param seconds 从起始日期开始，要计算多长时间的收益，秒
 * @return
 */

function calculateTotalIncome(difficultyList, sinceTime, seconds) {
	var count = difficultyList.length;
	var total = 0;

	for (var i = 0; i < count; i++) {
		var d = difficultyList[i];
		var time = d.time;
		var nextTime = 0;
		if (i + 1 < count) {
			nextTime = difficultyList[i + 1].time;
		} else {
			nextTime = 2147483647;
		}

		var calcStartTime = math.max(time, sinceTime);
		var calcEndTime = math.min(nextTime, sinceTime + seconds);
		var calcSeconds = calcEndTime - calcStartTime;
		if (calcSeconds > 0) {
			var difficulty = d.difficulty;
			var tmp = math.select(calcSeconds).multiply(25).divide(getTimePerBlock(difficulty, 1)).done();
			total = total + tmp;
			sinceTime += calcSeconds;
			seconds -= calcSeconds;
		}
	}

	return total;
}

function unixTimeToDate(seconds) {
	return new Date(seconds * 1000); // seconds是秒数，先乘1000得到毫秒数
}

function formatDate (dateStr) {
	return new Date(dateStr);
}

function dateToUnixTime (date) {
	return date.getTime() / 1000;
}


function test() {
	getTimePerBlock(1, 1);
	getTimePerBlock(2, 2);
	getTimePerBlock(1, 2);

	var difficultyList = [{
		time: 1375724800,
		difficulty: 37392766
	}, {
		time: 1376463743,
		difficulty: 50810339
	}, {
		time: 1377344184,
		difficulty: 65750060
	}, {
		time: 1378268500,
		difficulty: 86933018
	}];

	var start = dateToUnixTime(formatDate("2013-08-20 00:00:00"));
	var end = dateToUnixTime(formatDate("2013-09-07 11:11:51"));

	var income = calculateTotalIncome(difficultyList,start, end - start);
	console.log("1G收益：", income * 1000000000);
	console.log(0.14600000	+0.00075123 - income * 1000000000)//0.00017274659113000745

}

test();

