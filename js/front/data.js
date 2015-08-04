var ss = require('simple-statistics')
var numeral = require('numeral')
var chart = require('./chart')
module.exports = { loadPopUp: loadPopUp, loadDataStatTest: loadDataStatTest }

function loadPopUp (from) {
	loadData(from, function (data) { openPopUp(computeData(data)) })
}

function loadData (from, callback) {
	var loaded = {}
	if (from == "ALL") {
		var i = 0
		allDataDB("TRACKPAD", "distance", function (data) { loaded.trackpadByDistance = data; i++; if (i==4) callback(loaded) })
		allDataDB("FLECHES", "distance", function (data) { loaded.flechesByDistance = data; i++ ; if (i==4) callback(loaded) })
		allDataDB("TRACKPAD", "taille", function (data) { loaded.trackpadBySize = data; i++ ; if (i==4) callback(loaded) })
		allDataDB("FLECHES", "taille", function (data) { loaded.flechesBySize = data; i++; if (i==4) callback(loaded) })
	} else if (from == "THIS SESSION") {
		callback({
			trackpadByDistance: dataResults.TRACKPAD.filterBy("distance"),
			flechesByDistance: dataResults.FLECHES.filterBy("distance"),
			trackpadBySize: dataResults.TRACKPAD.filterBy("taille"),
			flechesBySize: dataResults.FLECHES.filterBy("taille"),
		})
	}
}

function computeData (loaded) {
	var data = {}, mean = {}, std = {}

	//Chart 1 : Performance à taille de cible fixée
	/* MOYENNE */mean.trackpadByDistance = loaded.trackpadByDistance.vitesse().mean()
	/* STD */std.trackpadByDistance = loaded.trackpadByDistance.vitesse().std()
	data.trackpadByDistance = loaded.trackpadByDistance.sortBy("distance")
	data.trackpadByDistance = data.trackpadByDistance.meanArray("TRACKPAD", "distance")
	/* PRECISION */data.precisionTrackpad = data.trackpadByDistance.distancePrecision()
	data.trackpadByDistance = data.trackpadByDistance.distanceVitesse()
	/* MOYENNE */mean.flechesByDistance = loaded.flechesByDistance.vitesse().mean()
	/* STD */std.flechesByDistance = loaded.flechesByDistance.vitesse().std()
	data.flechesByDistance = loaded.flechesByDistance.sortBy("distance")
	data.flechesByDistance = data.flechesByDistance.meanArray("FLECHES", "distance")
	/* PRECISION */data.precisionFleches = data.flechesByDistance.distancePrecision()
	data.flechesByDistance = data.flechesByDistance.distanceVitesse()
	
	//Chart 2 : Performance à distance fixée
	/* MOYENNE */mean.trackpadBySize = loaded.trackpadBySize.vitesse().mean()
	/* STD */std.trackpadBySize = loaded.trackpadBySize.vitesse().std()
	data.trackpadBySize = loaded.trackpadBySize.sortBy("taille")
	data.trackpadBySize = data.trackpadBySize.meanArray("TRACKPAD", "taille")
	data.trackpadBySize = data.trackpadBySize.tailleVitesse()
	/* MOYENNE */mean.flechesBySize = loaded.flechesBySize.vitesse().mean()
	/* STD */std.flechesBySize = loaded.flechesBySize.vitesse().std()
	data.flechesBySize = loaded.flechesBySize.sortBy("taille")
	data.flechesBySize = data.flechesBySize.meanArray("FLECHES", "taille")
	data.flechesBySize = data.flechesBySize.tailleVitesse()
	
	// //Chart 3 : Précision
	/* MOYENNE */mean.precisionTrackpad = data.precisionTrackpad.precision().mean()
	/* STD */std.precisionTrackpad = data.precisionTrackpad.precision().std()
	/* MOYENNE */mean.precisionFleches = data.precisionFleches.precision().mean()
	/* STD */std.precisionFleches = data.precisionFleches.precision().std()
	return { data: data, mean: mean, std: std }
}

isPopUpOpened = false;
function openPopUp (data) {
	var mean = data.mean, std = data.std, data = data.data
	if (isPopUpOpened) { return; };
	$("#myModal").modal();

	chart.buildChartDistance(
		data.trackpadByDistance, 
		data.flechesByDistance, 
		mean.trackpadByDistance, 
		mean.flechesByDistance,
		std.trackpadByDistance, 
		std.flechesByDistance
		)
	chart.buildChartSize(
		data.trackpadBySize,
		data.flechesBySize,
		mean.trackpadBySize,
		mean.flechesBySize,
		std.trackpadBySize,
		std.flechesBySize
		)
	chart.buildChartPrecision(
		data.precisionTrackpad,
	 	data.precisionFleches,
	 	mean.precisionTrackpad,
	 	mean.precisionFleches,
	 	std.precisionTrackpad,
	 	std.precisionFleches
	 	)

	isPopUpOpened = true;
	$('#myModal').on('hidden.bs.modal', function (e) { isPopUpOpened = false })
}

// —————————————————————————————————————————————————————————————————————————————
// Data 
// —————————————————————————————————————————————————————————————————————————————
	function allDataDB (device, xAxis, callback) {
		//data : tableau de tous les objets { temps, distance, taille, précision } de chaque test 
		// à taille fixee ou à distance fixee
		db[DONNEE]._findFetch({ device: device },{}, function (res) {
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

	Array.prototype.filterBy = function (xAxis) {
		data = []
		this.forEach(function (value) {
			if (xAxis == "distance" && value.taille == SIZECELLS.NORMAL) { data.push(value) }
			if (xAxis == "taille" && value.distance == DISTANCEFIXEE) { data.push(value) }
		})
		return data
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

	Array.prototype.normalSize = function (){
		var data = []
		this.forEach(function (value) {
			if (value.taille == SIZECELLS.NORMAL) { data.push(value) }
		})
		return data
	}

// —————————————————————————————————————————————————————————————————————————————
// TESTS D'HYPOTHESES 
// —————————————————————————————————————————————————————————————————————————————
	function loadDataStatTest (argument) {
		allDataArraySpeed(function (data) { computeDataStatTest(data) })
	}

	function allDataArraySpeed (callback) {
	// data.T : tableau des vitesses moyennes avec trackpad de chaque testeurs 
	// data.F : tableau des vitesses moyennes avec flèche de chaque testeurs 
		data = { T:[], F:[] }
		db[DONNEE]._findFetch({},{}, function (res) {
		    res.forEach(function (value) {
	    			if (value.device == "TRACKPAD") { data.T.push(value.dataResults.normalSize().vitesse().mean()) };
	    			if (value.device == "FLECHES") { data.F.push(value.dataResults.normalSize().vitesse().mean()) };
	    	})
			callback(data)
		})
	}

	function computeDataStatTest (data) {
		for (var i = 0; i <= data.T.length - 1; i++) {
			if (i==0) { str = "x<-sort(c(" + data.T[i]}
			else { str = str +"," + data.T[i] }
		};
		str = str +"))"
		console.log(data.F.length)
		// test d'hypothèse

	}


// —————————————————————————————————————————————————————————————————————————————
// GESTION DE LA BD DANS CHROME 
// —————————————————————————————————————————————————————————————————————————————
	//A coller dans la console de Chrome en cas de valeur aberrante

	function removeTheLessPreciseSerie () {
		db[DONNEE]._findFetch({},{}, function (res) {
			var precisionMax = 0
			var IDprecisionMax = 0
		    res.forEach(function (value) {
				value.dataResults.forEach(function (results) {
	    			if (results.precision>precisionMax) { 
	    				precisionMax = results.precision
	    				IDprecisionMax = value._id
	    				console.log(precisionMax)
	    			}
		    	})
			})
			db[DONNEE].remove(IDprecisionMax,function(){},function(){})
		})
	}

	function removeASeriePerformanceBySize (size) {
		db[DONNEE]._findFetch({},{}, function (res) {
		    res.forEach(function (value) {
				value.dataResults.forEach(function (results) {
					if (results.taille == size) { 
	    				console.log(results)
						db[DONNEE].remove(value._id,function(){},function(){})
		    		}
		    	})
			})
		})
	}
