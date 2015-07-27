var stat = require("./stat")
module.exports = { openPopUp: openPopUp }

isPopUpOpened = false;

function openPopUp (array1, array2, array3, array4) {
	if (isPopUpOpened) { return; };
	$("#myModal").modal();

	performanceData(array1, array2)
	precisionData(array1, array2)
	sizeData(array3, array4)

	isPopUpOpened = true;
	$('#myModal').on('hidden.bs.modal', function (e) { isPopUpOpened = false })
}

function performanceData (array1, array2) {
	data1 = stat.meanStd(data2speedarray(array1)) 
	data2 = stat.meanStd(data2speedarray(array2))
	$(function () {
		buildChart(
			'#chartContainer',
			performanceSerie(array1, false), 
			performanceSerie(array2, false),
			'Performance à taille de cible fixée ('+SIZECELLS.NORMAL+" px)",
			'Nombre de cases',
			'Vitesse',
			"Trackpad : "+data1.Mean+" cases/s — Flèches : "+data2.Mean+" cases/s",
			' cases/s'
			) 
	});
}

function sizeData (array1, array2) {
	data1 = stat.meanStd(data2speedarray(array1)) 
	data2 = stat.meanStd(data2speedarray(array2))
	$(function () {
		buildChart(
			'#chartContainerSize',
			performanceSerie(array1, true), 
			performanceSerie(array2, true),
			'Performance à distance fixée ('+DISTANCEFIXEE+" cases)",
			'Taille des cases',
			'Vitesse',
			"Trackpad : "+data1.Mean+" cases/s — Flèches : "+data2.Mean+" cases/s",
			' cases/s'
			) 
	});
}

function precisionData (array1, array2) {
	data1 = stat.meanStd(data2precision(array1)) 
	data2 = stat.meanStd(data2precision(array2))
	$(function () {
		buildChart(
			'#chartContainerPrecision',
			precisionSerie(array1), 
			precisionSerie(array2),
			'Précision',
			'Nombre de cases',
			'Temps de validation une fois la case passée',
			"Trackpad : "+data1.Mean+" ms — Flèches : "+data2.Mean+" ms",
			' ms'
			) 
	});
}


// —————————————————————————————————————————————————————————————————————————————
// FONCTIONS ANNEXES PRECISION
// —————————————————————————————————————————————————————————————————————————————
function precisionSerie (array) {
	data = arrayOfjson2Array0fArrayPrecision(array)
	data = data.sort(function (a,b) { return a[0]-b[0] })
	return data
}

function arrayOfjson2Array0fArrayPrecision (arrayOfjson) {
// [{ distance: 10, precision: 02:00}, { distance: 50, precision: 10:0}] --> [[10, 2.00], [50, 10.00]]
	var data = []
	arrayOfjson.forEach(function (value) {
		data.push([value.distance, value.precision])
	})
	return data	
}

function data2precision (array) {
	data = []
	array.forEach(function (value) { data.push(value.precision) })
	return data	
}

// —————————————————————————————————————————————————————————————————————————————
// FONCTIONS ANNEXES PERFORMANCE
// —————————————————————————————————————————————————————————————————————————————
function performanceSerie (array, isSize) {
	data = temps2speed(array, isSize)
	data = data.sort(function (a,b) { return a[0]-b[0] })
	data = duplicate2average(data) 
	return data
}

function temps2speed (array, isSize) {
// [{ distance: 10, temps: "02:00"}, { distance: 50, temps: "10:00"}] --> [[10, 5.00], [50, 5.00]]
	var data = []
	array.forEach(function (value) {
		temps = Number(value.temps.replace(":","."))
		if (temps > 0 && !isSize){
			data.push([value.distance, Math.trunc(value.distance/temps*100)/100])
		}
		if (temps > 0 && isSize)
			data.push([value.taille, Math.trunc(value.distance/temps*100)/100])
	})
	return data
}

function duplicate2average (array) {
/// [[0,1], [0,3], [4,1]] --> [[0,2], [4,1]]
//	Requiert une liste triée par x et [pas de doublon || des doublons simples]
	var data = []
	for (var i = 0; i <= array.length - 1;) {
		if (i == array.length - 1) {
			data.push(array[i])
		} else if (array[i][0] != array[i+1][0]){
			data.push(array[i])
		} else {
			average = (array[i][1] + array[i+1][1])/2
			data.push([array[i][0], average])
			i++;
		}
		i++
	};
	return data	
}

function data2speedarray (array) {
// [{ distance: 10, temps: "02:00"}, { distance: 50, temps: "10:00"}] --> [2.00, 5.00]
	var data = []
	array.forEach(function (value) {
		temps = Number(value.temps.replace(":","."))
		if (temps > 0)
			data.push(Math.trunc(value.distance/temps*100)/100)
	})
	return data
}

function buildChart (chart, serie1, serie2, title, xAxisTitle, yAxisTitle, subtitle, unite) {
    $('#myModal').on('shown.bs.modal', function() {
	    $(chart).highcharts({
	    	title:{ text: title },
	    	subtitle: { text: subtitle, align: 'center', x: -10 },
	        xAxis:{ title: { text: xAxisTitle } },
	        yAxis: { 
	        	title: { text: yAxisTitle }, 
	        	min: 0,
	        	plotLines: [{ value: 0, width: 1, color: '#808080' }]
	        },
	        tooltip: { valueSuffix: unite },
	        legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0 },
	        series: [
	        	{ name: "Trackpad", data: serie1 }, 
	        	{ name: "Flèches", data: serie2 }
	    	],
	    	credits: { enabled: false } 
	    });
    });
}