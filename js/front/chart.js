module.exports = {
	buildChartDistance: buildChartDistance,
	buildChartSize: buildChartSize,
	buildChartPrecision: buildChartPrecision,
}

// —————————————————————————————————————————————————————————————————————————————
// Chart
// —————————————————————————————————————————————————————————————————————————————
function buildChartDistance (array1, array2, mean1, mean2) {
	$(function () {
		buildChart(
			'#chartContainer',
			array1,
			array2,
			'Performance à taille de cible fixée ('+SIZECELLS.NORMAL+" px)",
			'Nombre de cases',
			'Vitesse',
			"Trackpad : "+mean1+" cases/s — Flèches : "+mean2+" cases/s",
			' cases/s'
			) 
	});
}

function buildChartSize (array1, array2, mean1, mean2) {
	$(function () {
		buildChart(
			'#chartContainerSize',
			array1, 
			array2,
			'Performance à distance fixée ('+DISTANCEFIXEE+" cases)",
			'Taille des cases',
			'Vitesse',
			"Trackpad : "+mean1+" cases/s — Flèches : "+mean2+" cases/s",
			' cases/s'
			) 
	});
}

function buildChartPrecision (array1, array2, mean1, mean2) {
	$(function () {
		buildChart(
			'#chartContainerPrecision',
			array1, 
			array2,
			'Précision',
			'Nombre de cases',
			'Temps de validation une fois la case passée',
			"Trackpad : "+mean1+" ms — Flèches : "+mean2+" ms",
			' ms'
			) 
	});
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