var ss = require('simple-statistics')
var numeral = require('numeral')
var chart = require('./chart')
module.exports = { loadPopUpRessenti: loadPopUpRessenti }

function loadPopUpRessenti () {
	openPopUp(computeData(loadData()))
}

function loadData () {
	var effortMental = {}, precision = {}, rapidite = {}, confort = {}
	
	effortMental.trackpad = [3,4,4,4,5,5,5,5,4,4]
	precision.trackpad = [5,4,3,3,4,4,4,3,2,2]
	rapidite.trackpad = [5,4,5,3,4,4,5,5,3,3]
	confort.trackpad = [5,3,4,4,5,4,5,4,4,3]

	effortMental.fleches = [5,4,5,5,5,5,5,5,4,5]
	rapidite.fleches = [2,2,3,1,1,2,2,2,3,3]
	precision.fleches = [5,3,5,4,4,4,5,5,4,5]
	confort.fleches = [1,1,3,1,2,2,2,3,2,3]
	
	return {effortMental : effortMental, precision : precision, rapidite: rapidite, confort : confort}
}

function computeData (data) {
	var trackpadMeans = [
		data.effortMental.trackpad.mean(),
		data.precision.trackpad.mean(),
		data.rapidite.trackpad.mean(),
		data.confort.trackpad.mean(),
	]
	var flechesMeans = [
		data.effortMental.fleches.mean(),
		data.precision.fleches.mean(),
		data.rapidite.fleches.mean(),
		data.confort.fleches.mean(),
	]
	return { trackpadMeans: trackpadMeans, flechesMeans: flechesMeans}
}

isPopUpOpenedRessenti = false;
function openPopUp (data) {
	if (isPopUpOpenedRessenti) { return; };
	$("#myModalRessenti").modal();
	chart.buildChartRessenti(data.trackpadMeans, data.flechesMeans)
	isPopUpOpenedRessenti = true;
	$('#myModalRessenti').on('hidden.bs.modal', function (e) { isPopUpOpenedRessenti = false })
}

// —————————————————————————————————————————————————————————————————————————————
// FONCTIONS ANNEXES 
// —————————————————————————————————————————————————————————————————————————————
	Array.prototype.mean = function () {
		return Number(numeral(ss.mean(this)).format('0.00'))
	}

	Array.prototype.std = function () {
		return Number(numeral(ss.standard_deviation(this)).format('0.00'))
	}