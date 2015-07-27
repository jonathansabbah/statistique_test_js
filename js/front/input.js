var chrono = require('./chrono')
var scroll = require('scroll')
var stat = require('./stat')
var chart = require('./chart')
var precision = require('./precision')
module.exports = { keydown: keydown }

// —————————————————————————————————————————————————————————————————————————————
// Input/Output
// —————————————————————————————————————————————————————————————————————————————
var endArrayCells
function clic (device) {
	if (cellNumber != ARRAYCELLS[currentCellToGet]) { return; }
	endArrayCells = (currentCellToGet == (ARRAYCELLS.length-1))

	//DATA
	if (currentCellToGet>=IGNORED) {
		dataResults[device].push({	
			distance : Math.abs(cellNumber), 
			taille: cellHeight,
			temps : chrono.displayTime(sec,decisec), 
			precision: precision.saveAndResetPrecisionTime()
		})
	};
	currentCellToGet = (currentCellToGet+1) % ARRAYCELLS.length
	cellHeightIndex = (cellHeightIndex+1) % ARRAYSIZECELLS.length
	cellHeight = ARRAYSIZECELLS[cellHeightIndex]
	if (endArrayCells) { deviceTested++ };
	if (endArrayCells) { 
		db.donnee.upsert({
			device: device, 
			orientation: "vertical",
			date: new Date(),
			dataResults: lastResults(dataResults[device])
		}, function() { console.log("Résultat ajouté") })
	}

	//VUE
	document.body.scrollTop = Math.floor(TOTALCELLS/2)*cellHeight //Retour au milieu
	if (endArrayCells) {
		document.getElementById("device").innerHTML =
		(document.getElementById("device").innerHTML == "Trackpad")? "Flèches":	"Trackpad";
	};	
	document.getElementById("cellToGet").innerHTML = 
		(endArrayCells && deviceTested%2==1)? "Appuyer sur zéro" : ARRAYCELLS[currentCellToGet];
	if (endArrayCells && deviceTested%2==0) { loadPopUp("THIS SESSION") }

	//CHRONO
	chrono.chronoReset();
	if (!endArrayCells) { chrono.chronoStart(); }
}

function keydown(evt) {
	var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();
	switch (keyCode) {
		//Trackpad
        case 96: //zéro pavé numérique
            if (isStopped){ chrono.chronoStart() } else { chrono.chronoPause(); }
			if (endArrayCells && deviceTested%2==1) document.getElementById("cellToGet").innerHTML = ARRAYCELLS[currentCellToGet];
           break;
        case 82: //"R"
        	chrono.chronoReset();
            break;
        //Fleches
        case 38: //down
        	animateScroll(-cellHeight);
            break;
        case 40: //up
        	animateScroll(cellHeight);
        	break;
        case 13: //entrée
        	clic("FLECHES");
            break;
        case 65: //a
			loadPopUp ("ALL")
            break;
    }
}

window.onclick = function () { clic("TRACKPAD"); }

isScrolling = false
function animateScroll (d) {
	if (isScrolling){ return; }
	MAXCELLHEIGHT = 500
	MINCELLHEIGHT = 100
	IDEALSPEEDMIN = 80
	IDEALSPEEDMAX = 200
	TEMP250 = 110
	//étalage linéaire entre MIN-MAX et les vitesses idéales 
	duration = (cellHeight==250)? TEMP250 : (cellHeight-MINCELLHEIGHT)/(MAXCELLHEIGHT-MINCELLHEIGHT) * (IDEALSPEEDMAX-IDEALSPEEDMIN) + IDEALSPEEDMIN
	isScrolling = true;
	scroll.top(document.body,document.body.scrollTop+d, { duration: duration, ease: 'inOutQuad' }, function(error, position) {
		isScrolling = false
	})
}

// —————————————————————————————————————————————————————————————————————————————
// FONCTIONS ANNEXES
// —————————————————————————————————————————————————————————————————————————————
function loadPopUp (from) {
	var dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize
	if (from == "ALL") {
		var i = 0
		stat.allData("TRACKPAD", "distance", function (data) {
			dataTrackpadByDistance = data
			i++
			if (i==4) { computeArrayData(dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize) }
		})
		stat.allData("FLECHES", "distance", function (data) {
			dataFlechesByDistance = data
			i++
			if (i==4) { computeArrayData(dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize) }
		})
		stat.allData("TRACKPAD", "taille", function (data) {
			dataTrackpadBySize = data
			i++
			if (i==4) { computeArrayData(dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize) }
		})
		stat.allData("FLECHES", "taille", function (data) {
			dataFlechesBySize = data
			i++
			if (i==4) { computeArrayData(dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize) }
		})
	}
	if (from == "THIS SESSION") {
		dataTrackpadByDistance = dataResults.TRACKPAD
		dataFlechesByDistance = dataResults.FLECHES
		dataTrackpadBySize = dataResults.TRACKPAD
		dataFlechesBySize = dataResults.FLECHES
		computeArrayData(dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize)
	}
}

function computeArrayData (data1, data2, data3, data4) {
	var dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize
	
	dataTrackpadByDistance = stat.sort(data1, "distance")
	dataFlechesByDistance = stat.sort(data2, "distance")
	dataTrackpadBySize = stat.sort(data3, "taille")
	dataFlechesBySize = stat.sort(data4, "taille")
	dataTrackpadByDistance = stat.meanArray(dataTrackpadByDistance, "TRACKPAD", "distance")
	dataFlechesByDistance = stat.meanArray(dataFlechesByDistance, "FLECHES", "distance")
	dataTrackpadBySize = stat.meanArray(dataTrackpadBySize, "TRACKPAD", "taille")
	dataFlechesBySize = stat.meanArray(dataFlechesBySize, "FLECHES", "taille")

	chart.openPopUp(dataTrackpadByDistance, dataFlechesByDistance, dataTrackpadBySize, dataFlechesBySize)
}
function lastResults (dataArray) {
	var size = (TOTALCELLSTOGET-IGNORED>=0)? TOTALCELLSTOGET-IGNORED : TOTALCELLSTOGET
	var firstIndex = (dataArray.length/size-1)*size
	return dataArray.slice(firstIndex,firstIndex+size)
}