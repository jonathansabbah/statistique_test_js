var ss = require('simple-statistics')
var numeral = require('numeral')

module.exports = {
	displayStat: displayStat,
	stringStat, stringStat,
}

// —————————————————————————————————————————————————————————————————————————————
// Stat
// —————————————————————————————————————————————————————————————————————————————
function displayStat () {
	console.log()
	console.log("Trackpad "+mean_std(dataToArray(dataResults.TRACKPAD)))
	console.log("Flèches  "+mean_std(dataToArray(dataResults.FLECHES)))
	console.log("Trackpad " +by_distance(dataResults.TRACKPAD))
	console.log("Fleches " +by_distance(dataResults.FLECHES))
}

function stringStat () {
	return "<p>Trackpad "+mean_std(dataToArray(dataResults.TRACKPAD))+ "<p>"
	+"<p>Flèches  "+mean_std(dataToArray(dataResults.FLECHES))+ "<p>"
	+"<p>Trackpad " +by_distance(dataResults.TRACKPAD)+ "<p>"
	+"<p>Fleches " +by_distance(dataResults.FLECHES)+ "<p>"
}

function by_distance (data) {
	var pres = [], loin =[], tres_loin =[]
	data.forEach(function (value) {
		var distance = value.distance;
		var number = Number(value.temps.replace(":","."))		
		if (distance <= PRES) {
			pres.push(number);
		} else if (distance <= LOIN && distance > PRES) {
			loin.push(number);
		} else if (distance > LOIN) {
			tres_loin.push(number);
		}
	})
	var mean_pres = mean_std(pres);
	var mean_loin = mean_std(loin);
	var mean_tres_loin = mean_std(tres_loin);
	return "(Près = "+mean_pres+", Loin = "+mean_loin+", Très_loin = "+mean_tres_loin+")"
}

function dataToArray (json) {
	var data = []
	json.forEach(function (value) {
		data.push(Number(value.temps.replace(":",".")))
	})
	return data
}

function mean_std (data) {
	if (data.length==0) { return "(Mean = 0:00, Std = 0:00)"; }
	var mean = ss.mean(data);
	var std = ss.standard_deviation(data);
	return "(Mean = "+ formatize(mean) + ", Std = "+ formatize(std)+")";
}

function formatize (number) {
	return numeral(number).format('0.00');
}
