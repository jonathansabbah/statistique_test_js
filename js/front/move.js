var draw = require('./draw');
var input = require('./input');
var precision = require("./precision");
var minimongo = require("minimongo");

loop();
function init () {
	//Accès clavier
	document.body.addEventListener("keydown",function (evt) { input.keydown(evt) }, false);

	//Init des cases à atteindre
	ARRAYCELLS = buildRandomInput()
	document.getElementById("cellToGet").innerHTML = ARRAYCELLS[0]
	
	// //Init des tailles de cellules
	ARRAYSIZECELLS = buildCellSize()
	cellHeightIndex = 0
	cellHeight = ARRAYSIZECELLS[cellHeightIndex]

	//Placement au milieu
	setTimeout(function () {
		document.body.scrollTop = Math.floor(TOTALCELLS/2)*SIZECELLS.NORMAL
	}, 10)
	
	//Initialisation de la BD
	var IndexedDb = minimongo.IndexedDb;
	db = new IndexedDb({namespace: "dbStat"}, function() {
		db.addCollection("donnee");
	}, function() { alert("Erreur IndexedDB!"); });

	//Test de Précision
	precisionFirstPassage = true
}

var start = true;
function loop () {
	setInterval(function () {
		var scrollY = document.body.scrollTop+cellHeight/2;
		cellNumberTemp = -Math.floor((scrollY - scrollY%cellHeight)/cellHeight)+Math.floor(TOTALCELLS/2)
		if (start) {
			draw.drawCells(cellNumberTemp)
			cellNumber = cellNumberTemp
			init();
			start = false
		} else {
	 		if (cellNumberTemp != cellNumber) {
				draw.drawCells(cellNumberTemp)
	 			cellNumber = cellNumberTemp
	 			if (currentCellToGet>=IGNORED) { precision.precisionCheck() }
	 		}
	 	} 
	}, 1/FPS*1000)
}

DISTANCEFIXEE = Math.floor(TOTALCELLS/4)
function buildRandomInput () {
	var distance = []
	totalCellToGetAdjusted = (TOTALCELLSTOGET > TOTALCELLS)? TOTALCELLS : TOTALCELLSTOGET
	for (var i = 0; i < totalCellToGetAdjusted; i++){
		do { var num = randomInt(TOTALCELLS) }	while (distance.contains(num))
		distance.push(num);
	}
	if (totalCellToGetAdjusted >= 3) {
		distance[distance.length-3] = DISTANCEFIXEE
		distance[distance.length-2] = DISTANCEFIXEE
		distance[distance.length-1] = DISTANCEFIXEE
	}
	return distance;
}

function buildCellSize () {
	var size = []
	totalCellToGetAdjusted = (TOTALCELLSTOGET > TOTALCELLS)? TOTALCELLS : TOTALCELLSTOGET
	for (var i = 0; i < totalCellToGetAdjusted; i++){
		size.push(SIZECELLS.NORMAL);
	}
	if (totalCellToGetAdjusted >= 3) {
		size[size.length-2] = randomIntInRange(SIZECELLS.PETIT, SIZECELLS.NORMAL);
		size[size.length-1] = randomIntInRange(SIZECELLS.NORMAL, SIZECELLS.GRAND);
	}
	return size;
}

// —————————————————————————————————————————————————————————————————————————————
// FONCTIONS ANNEXES
// —————————————————————————————————————————————————————————————————————————————

function randomInt (radius) {
	//Renvoi un nombre entier entre radius (inclus) et -radius (inclus)
	return Math.floor(radius*Math.random())-Math.floor(radius/2)
}

function randomIntInRange(start,end){
       return Math.floor(start + (1+end-start)*Math.random())  
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) { if (this[i] === obj) { return true; } }
    return false;
}