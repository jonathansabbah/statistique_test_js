module.exports = {
	buildChartDistance: buildChartDistance,
	buildChartSize: buildChartSize,
	buildChartPrecision: buildChartPrecision,
	buildChartRessenti, buildChartRessenti,
}

// —————————————————————————————————————————————————————————————————————————————
// Chart
// —————————————————————————————————————————————————————————————————————————————
function buildChartDistance (array1, array2, mean1, mean2, std1, std2) {
	$(function () {
		buildChart(
			'#chartContainer',
			array1,
			array2,
			'Performance à taille de cible fixée ('+SIZECELLS.NORMAL+" px)",
			'Nombre de cases',
			'Vitesse',
			"Trackpad : "+mean1+" cases/s (std:"+ std1 +") — Flèches : "+mean2+" cases/s (std:"+ std2 +")",
			' cases/s'
			) 
	});
}

function buildChartSize (array1, array2, mean1, mean2, std1, std2) {
	$(function () {
		buildChart(
			'#chartContainerSize',
			array1, 
			array2,
			'Performance à distance fixée ('+DISTANCEFIXEE+" cases)",
			'Taille des cases',
			'Vitesse',
			"Trackpad : "+mean1+" cases/s (std:"+ std1 +") — Flèches : "+mean2+" cases/s (std:"+ std2 +")",
			' cases/s'
			) 
	});
}

function buildChartPrecision (array1, array2, mean1, mean2, std1, std2) {
	$(function () {
		buildChart(
			'#chartContainerPrecision',
			array1, 
			array2,
			'Précision à taille de cible fixée ('+SIZECELLS.NORMAL+' px)',
			'Nombre de cases',
			'Temps de validation une fois la case passée',
			"Trackpad : "+mean1+" ms (std:"+ std1 +") — Flèches : "+mean2+" ms (std:"+ std2 +")",
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
	        	{ name: "Trackpad", color: 'rgba(15,121,165,1)', data: serie1 }, 
	        	{ name: "Flèches", color: 'rgba(249,146,46,1)', data: serie2 }
	    	],
	    	credits: { enabled: false } 
	    });
    });
}

function buildChartRessenti (serie1, serie2) {
	 $('#myModalRessenti').on('shown.bs.modal', function() {
     	$("#chartContainerRessenti").highcharts({
	        chart: { type: 'bar' },
	        title: { text: 'Ressenti' },
	        plotOptions: {
	            series: { borderWidth: 0, dataLabels: { enabled: true, format: '{point.y:.1f}' } }
	        },
	        xAxis: {
	            categories: [
	                'Effort mental (1: très important — 5: très faible)',
	                'Précision (1: très peu précis  — 5: très précis)',
	                'Rapidité (1: très lent — 5: très rapide)',
	                'Confort général (1: très inconfortable — 5: très confortable)'
	            ]  
	        },
	        yAxis: { min: 1, max: 5, title: { text: 'Satisfaction' } },
	        series: [
	            { name: 'Flèches', color: 'rgba(249,146,46,1)', data: serie2 },
	            { name: 'Trackpad', color: 'rgba(15,121,165,1)', data: serie1 }
	        ],
	      	credits: { enabled: false }
	       // legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle', borderWidth: 0 }
 	    });
    });
}