var ss = require('simple-statistics')
var numeral = require('numeral')

module.exports = {
	sort: sort,
	allData: allData,
	meanArray: meanArray,
	meanStd: meanStd
}

// —————————————————————————————————————————————————————————————————————————————
// Stat
// —————————————————————————————————————————————————————————————————————————————
function meanArray (data, device, xAxis) {
	//Calcul des moyennes de data par XAxis (= "distance" ou "taille")
 	finalData = []
 	for (var i = 0; i <= data.length - 1;) {
 		var j = 0, timeArray = [], precisionArray = []
 		do{
 			timeArray.push(Number(data[i+j].temps.replace(":",".")))
 			if (xAxis == "distance") { precisionArray.push(data[i+j].precision) } 
 			if (i+j == data.length - 1) { 
 				oneData = {
 					distance: data[i+j].distance,
 					temps: (ss.mean(timeArray)+"").replace(".",":"),
 				}
 				if (xAxis == "distance") { oneData.precision = ss.mean(precisionArray) }
 				if (xAxis == "taille") { oneData.taille = data[i+j].taille }
 				finalData.push(oneData)
 				return finalData
 			}
 			j++
 		} while (data[i+j-1][xAxis] == data[i+j][xAxis])
 		oneData = {
			distance: data[i+j-1].distance,
			temps: (ss.mean(timeArray)+"").replace(".",":"),
		}
		if (xAxis == "distance") { oneData.precision = ss.mean(precisionArray) }
		if (xAxis == "taille") { oneData.taille = data[i+j-1].taille }
 		finalData.push(oneData)
 		i=i+j
 	}
 	return finalData
}

function allData (device, xAxis, callback) {
	//data : tableau de tous les objets { temps, distance, taille, précision } de chaque test 
	// à taille fixee ou à distance fixee
	db.donnee._findFetch({ device: device },{}, function (res) {
		data = []
	    res.forEach(function (value) {
			value.dataResults.forEach(function (results) {
	    		if (xAxis == "distance" && results.taille == SIZECELLS.NORMAL) { data.push(results) }
	    		if (xAxis == "taille" && results.distance == DISTANCEFIXEE) { data.push(results) };
	    	})
		})
		console.log("Données "+device+" :"+ data.length)
		callback(data)
	})
}

function sort (data, xAxis) {
	//trie par distance ou par taille
	return data.sort(function (a,b) { 
		if (xAxis == "distance") { return a.distance-b.distance }
		if (xAxis == "taille") { return a.taille-b.taille }
	})
}

function meanStd (array) {
	return { Mean: formatize(ss.mean(array)), Std: formatize(ss.standard_deviation(array))}
}

function formatize (number) { return numeral(number).format('0.00'); }