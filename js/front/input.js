var chrono = require('./chrono')
var stat = require('./stat')
module.exports = {	keydown: keydown }

// —————————————————————————————————————————————————————————————————————————————
// Input/Output
// —————————————————————————————————————————————————————————————————————————————
var endArrayCells
function clic (device) {
	if (cellNumber != ARRAYCELLS[currentCellToGet]) { return; }
	endArrayCells = (currentCellToGet == (ARRAYCELLS.length-1))

	//DATA
	if (currentCellToGet>=IGNORED) {
		dataResults[device].push({	distance : Math.abs(cellNumber), temps : chrono.displayTime(sec,decisec)})
	};
	currentCellToGet = (currentCellToGet+1) % ARRAYCELLS.length
	if (endArrayCells) { deviceTested++ };
	if (endArrayCells) { 
		db.donnee.upsert({
			device: device, 
			taille: CELLHEIGHT, 
			orientation: "vertical",
			date: new Date(),
			dataResults: lastResults(dataResults[device])
		}, function() { console.log("Résultat ajouté") })
	}

	//VUE
	document.body.scrollTop = Math.floor(TOTALCELLS/2)*CELLHEIGHT //Retour au milieu
	if (endArrayCells) {
		document.getElementById("device").innerHTML =
		(document.getElementById("device").innerHTML == "Trackpad")? "Flèches":	"Trackpad";
	};	
	document.getElementById("cellToGet").innerHTML = 
		(endArrayCells && deviceTested%2==1)? "Appuyer sur zéro" : ARRAYCELLS[currentCellToGet];
	if (endArrayCells && deviceTested%2==0) { openPopUp(stat.stringStat()) };
	stat.displayStat(); 

	//CHRONO
	chrono.chronoReset();
	if (!endArrayCells) { chrono.chronoStart(); }
}

isPopUpOpened = false;
function openPopUp (text) {
	if (isPopUpOpened) { return; };
	$("#myModal").modal();
	document.getElementById("textModal").innerHTML = text; 
	isPopUpOpened = true;
	$('#myModal').on('hidden.bs.modal', function (e) {
	  isPopUpOpened = false
	})
}

function lastResults (dataArray) {
	var size = (TOTALCELLSTOGET-IGNORED>=0)? TOTALCELLSTOGET-IGNORED : TOTALCELLSTOGET
	var firstIndex = (dataArray.length/size-1)*size
	return dataArray.slice(firstIndex,firstIndex+size)
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
        	animateScroll(document.body.scrollTop,-CELLHEIGHT);
            break;
        case 40: //up
        	animateScroll(document.body.scrollTop,CELLHEIGHT);
        	break;
        case 13: //entrée
        	clic("FLECHES");
            break;
    }
}

window.onclick = function () { clic("TRACKPAD"); }

DURATION = 100
isScrolling = false
function animateScroll (a, b) {
	frameTime = 1/FPS*1000 //(en ms)
	if (isScrolling){ return; }

	init = true 
	var timer = setInterval(function () {
			isScrolling = true;

			//Animation
			document.body.scrollTop += b/(DURATION/frameTime)
			
			//Fin de l'animation
			if ((b>0 && document.body.scrollTop>a+b) || (b<0 && document.body.scrollTop<a+b)) { 
				isScrolling = false
				clearInterval(timer)
			}
			
			//Arrete l'intervalle en cas de dépassement du temps max DURATION 
			//(utile pour les valeurs max)
			if (init) { 
				setTimeout(function () { isScrolling = false; clearInterval(timer);}, DURATION);
				init = false
			}
	},frameTime)
}