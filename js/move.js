var stat = require('./stat');
var draw = require('./draw');
var chrono = require('./chrono');
var input = require('./input');
var mongo = require('./mongo');

loop();

function init () {
	//Accès clavier
	document.body.addEventListener("keydown",function (evt) { input.keydown(evt) }, false);

	//Init des cases à atteindre
	ARRAYCELLS = stat.buildRandomInput(TOTALCELLSTOGET)
	document.getElementById("cellToGet").innerHTML = ARRAYCELLS[0]
	
	//Retour au milieu
	document.body.scrollTop = Math.floor(TOTALCELLS/2)*CELLHEIGHT
}

var start = true;
function loop () {
	setInterval(function () {
		var scrollY = document.body.scrollTop+CELLHEIGHT/2;
		cellNumberTemp = -Math.floor((scrollY - scrollY%CELLHEIGHT)/CELLHEIGHT)+Math.floor(TOTALCELLS/2)
		if (start) {
			draw.drawCells(cellNumberTemp)
			cellNumber = cellNumberTemp
			init();
			start = false
		} else {
	 		if (cellNumberTemp != cellNumber) {
				draw.drawCells(cellNumberTemp)
	 			cellNumber = cellNumberTemp
	 		}
	 	} 
	}, 1/FPS*1000)
}