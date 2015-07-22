var draw = require('./draw');
var input = require('./input');
var minimongo = require("minimongo");

loop();
function init () {
	//Accès clavier
	document.body.addEventListener("keydown",function (evt) { input.keydown(evt) }, false);

	//Init des cases à atteindre
	ARRAYCELLS = buildRandomInput()
	document.getElementById("cellToGet").innerHTML = ARRAYCELLS[0]
	
	//Placement au milieu
	document.body.scrollTop = Math.floor(TOTALCELLS/2)*CELLHEIGHT

	//Initialisation de la BD
	var IndexedDb = minimongo.IndexedDb;
	db = new IndexedDb({namespace: "dbStat"}, function() {
		db.addCollection("donnee");
	}, function() { alert("some error!"); });
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

function buildRandomInput () {
	var distance = []
	for (var i = 0; i < TOTALCELLSTOGET; i++)
		distance.push(Math.floor((Math.random() * TOTALCELLS - TOTALCELLS/2)));
	return distance;
}