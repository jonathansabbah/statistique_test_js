var ss = require('simple-statistics')
var numeral = require('numeral')
var chart = require('./chart')
module.exports = { loadPopUp: loadPopUp }

function loadPopUp (from) {
	loadData(from, function (data) { openPopUp(computeData(data)) })
}

function loadData (from, callback) {
	var loaded = {}
	if (from == "ALL") {
		var i = 0
		allData("TRACKPAD", "distance", function (data) { loaded.trackpadByDistance = data; i++; if (i==4) callback(loaded) })
		allData("FLECHES", "distance", function (data) { loaded.flechesByDistance = data; i++ ; if (i==4) callback(loaded) })
		allData("TRACKPAD", "taille", function (data) { loaded.trackpadBySize = data; i++ ; if (i==4) callback(loaded) })
		allData("FLECHES", "taille", function (data) { loaded.flechesBySize = data; i++; if (i==4) callback(loaded) })
	} else if (from == "THIS SESSION") {
		callback({
			trackpadByDistance: dataResults.TRACKPAD,
			flechesByDistance: dataResults.FLECHES,
			trackpadBySize: dataResults.TRACKPAD,
			flechesBySize: dataResults.FLECHES,
		})
	}
}

function computeData (loaded) {
	var data = {}, mean = {}

	//Chart 1 : Performance à taille de cible fixée
	data.trackpadByDistance = loaded.trackpadByDistance.sortBy("distance")
	mean.trackpadByDistance = data.trackpadByDistance.vitesse().mean()
	data.trackpadByDistance = data.trackpadByDistance.meanArray("TRACKPAD", "distance")
	data.precisionTrackpad = data.trackpadByDistance.distancePrecision()
	data.trackpadByDistance = data.trackpadByDistance.distanceVitesse()
	data.trackpadByDistance = data.trackpadByDistance.sort(function (a,b) { return a[0]-b[0] })
	data.trackpadByDistance = duplicate2average(data.trackpadByDistance) 
	
	data.flechesByDistance = loaded.flechesByDistance.sortBy("distance")
	mean.flechesByDistance = data.flechesByDistance.vitesse().mean()
	data.flechesByDistance = data.flechesByDistance.meanArray("FLECHES", "distance")
	data.precisionFleches = data.flechesByDistance.distancePrecision()
	data.flechesByDistance = data.flechesByDistance.distanceVitesse()
	data.flechesByDistance = data.flechesByDistance.sort(function (a,b) { return a[0]-b[0] })
	data.flechesByDistance = duplicate2average(data.flechesByDistance)
	
	//Chart 2 : Performance à distance fixée
	data.trackpadBySize = loaded.trackpadBySize.sortBy("taille")
	mean.trackpadBySize = data.trackpadBySize.vitesse().mean()
	data.trackpadBySize = data.trackpadBySize.meanArray("TRACKPAD", "taille")
	data.trackpadBySize = data.trackpadBySize.tailleVitesse()
	data.trackpadBySize = data.trackpadBySize.sort(function (a,b) { return a[0]-b[0] })
	data.trackpadBySize = duplicate2average(data.trackpadBySize) 
	
	data.flechesBySize = loaded.flechesBySize.sortBy("taille")
	mean.flechesBySize = data.flechesBySize.vitesse().mean()
	data.flechesBySize = data.flechesBySize.meanArray("FLECHES", "taille")
	data.flechesBySize = data.flechesBySize.tailleVitesse()
	data.flechesBySize = data.flechesBySize.sort(function (a,b) { return a[0]-b[0] })
	data.flechesBySize = duplicate2average(data.flechesBySize)

	//Chart 3 : Précision
	mean.precisionTrackpad = data.precisionTrackpad.precision().mean()
	data.precisionTrackpad = data.precisionTrackpad.sort(function (a,b) { return a[0]-b[0] })

	mean.precisionFleches = data.precisionFleches.precision().mean()
	data.precisionFleches = data.precisionFleches.sort(function (a,b) { return a[0]-b[0] })

	return { data: data, mean: mean }
}

isPopUpOpened = false;
function openPopUp (data) {
	var mean = data.mean, data = data.data
	if (isPopUpOpened) { return; };
	$("#myModal").modal();

	chart.buildChartDistance(data.trackpadByDistance, data.flechesByDistance, mean.trackpadByDistance, mean.flechesByDistance)
	chart.buildChartSize(data.trackpadBySize, data.flechesBySize, mean.trackpadBySize, mean.flechesBySize)
	chart.buildChartPrecision(data.precisionTrackpad, data.precisionFleches, mean.precisionTrackpad, mean.precisionFleches)

	isPopUpOpened = true;
	$('#myModal').on('hidden.bs.modal', function (e) { isPopUpOpened = false })
}

// —————————————————————————————————————————————————————————————————————————————
// Data 
// —————————————————————————————————————————————————————————————————————————————
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

	Array.prototype.sortBy = function (xAxis) {
		//trie par distance ou par taille
		return this.sort(function (a,b) { 
			if (xAxis == "distance") { return a.distance-b.distance }
			if (xAxis == "taille") { return a.taille-b.taille }
		})
	}

	Array.prototype.meanArray = function (device, xAxis) {
		//Calcul des moyennes de this par XAxis (= "distance" ou "taille")
	 	finalData = []
	 	for (var i = 0; i <= this.length - 1;) {
	 		var j = 0, timeArray = [], precisionArray = []
	 		do{
	 			timeArray.push(Number(this[i+j].temps.replace(":",".")))
	 			if (xAxis == "distance") { precisionArray.push(this[i+j].precision) } 
	 			if (i+j == this.length - 1) { 
	 				oneData = {
	 					distance: this[i+j].distance,
	 					temps: (ss.mean(timeArray)+"").replace(".",":"),
	 				}
	 				if (xAxis == "distance") { oneData.precision = ss.mean(precisionArray) }
	 				if (xAxis == "taille") { oneData.taille = this[i+j].taille }
	 				finalData.push(oneData)
	 				return finalData
	 			}
	 			j++
	 		} while (this[i+j-1][xAxis] == this[i+j][xAxis])
	 		oneData = {
				distance: this[i+j-1].distance,
				temps: (ss.mean(timeArray)+"").replace(".",":"),
			}
			if (xAxis == "distance") { oneData.precision = ss.mean(precisionArray) }
			if (xAxis == "taille") { oneData.taille = this[i+j-1].taille }
	 		finalData.push(oneData)
	 		i=i+j
	 	}
	 	return finalData
	}

	function duplicate2average (array) {
	/// [[0,1], [0,3], [4,1]] --> [[0,2], [4,1]]
	//	Requiert une liste triée par x et [pas de doublon || des doublons simples]
		var data = []
		for (var i = 0; i <= array.length - 1;) {
			if (i == array.length - 1) { data.push(array[i]) } 
			else if (array[i][0] != array[i+1][0]){ data.push(array[i]) } 
			else {
				average = (array[i][1] + array[i+1][1])/2
				data.push([array[i][0], average])
				i++;
			}
			i++
		}
		return data	
	}

// —————————————————————————————————————————————————————————————————————————————
// FONCTIONS ANNEXES 
// —————————————————————————————————————————————————————————————————————————————
	Array.prototype.distanceVitesse = function (){
	// function temps2speed (array, xAxis) {
	// [{ distance: 10, temps: "02:00"}, { distance: 50, temps: "10:00"}] --> [[10, 5.00], [50, 5.00]]
		var data = []
		this.forEach(function (value) {
			temps = Number(value.temps.replace(":","."))
			if (temps > 0){
				data.push([value.distance, Math.trunc(value.distance/temps*100)/100])
			}
		})
		return data
	}

	Array.prototype.tailleVitesse = function (){
	// [{ taille: 10, distance: 50, temps: "02:00"}, { taille: 50, distance: 50, temps: "10:00"}] --> [[10, 2.50], [50, 5.00]]
		var data = []
		this.forEach(function (value) {
			temps = Number(value.temps.replace(":","."))
			if (temps > 0)
				data.push([value.taille, Math.trunc(value.distance/temps*100)/100])
		})
		return data
	}

	Array.prototype.distancePrecision = function () {
		// [{ distance: 10, precision: 02:00}, { distance: 50, precision: 10:0}] --> [[10, 2.00], [50, 10.00]]
		var data = []
		this.forEach(function (value) { data.push([value.distance, value.precision]) })
		return data	
	}

	Array.prototype.vitesse = function (){
	// [{ distance: 10, temps: "02:00"}, { distance: 50, temps: "10:00"}] --> [2.00, 5.00]
		var data = []
		this.forEach(function (value) {
			temps = Number(value.temps.replace(":","."))
			if (temps > 0) { data.push(Math.trunc(value.distance/temps*100)/100) }
		})
		return data
	}

	Array.prototype.precision = function () {
		data = []
		this.forEach(function (value) { data.push(value[1]) })
		return data	
	}

	Array.prototype.mean = function () {
		return numeral(ss.mean(this)).format('0.00')
	}

	Array.prototype.std = function () {
		return numeral(ss.standard_deviation(this)).format('0.00')
	}
