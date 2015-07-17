var chrono = require('./chrono')
var mongo = require('./mongo')
var stat = require('./stat')
module.exports = {
	keydown: keydown
}

// —————————————————————————————————————————————————————————————————————————————
// Input/Output
// —————————————————————————————————————————————————————————————————————————————
var endArrayCells
function clic (device) {
	if (cellNumber != ARRAYCELLS[currentCellToGet]) { return }
	endArrayCells = (currentCellToGet == ARRAYCELLS.length-1)? true : false

	//DATA
	if (currentCellToGet>=IGNORED) {
		dataResults[device].push(
			{
				distance : Math.abs(cellNumber),
				temps : chrono.displayTime(sec,decisec)
			})
	};
	currentCellToGet++;
	currentCellToGet = currentCellToGet % ARRAYCELLS.length
	// if (endArrayCells) { mongo.saveData(device, CELLHEIGHT, "vertical", dataResults["device"]) } 

	//VUE
	document.body.scrollTop = Math.floor(TOTALCELLS/2)*CELLHEIGHT //Retour au milieu
	if (endArrayCells) {
		document.getElementById("device").innerHTML =
		(document.getElementById("device").innerHTML == "Trackpad")? "Flèches":	"Trackpad";
	};
	document.getElementById("cellToGet").innerHTML = ARRAYCELLS[currentCellToGet];
	stat.displayStat(); 

	//CHRONO
	chrono.chronoReset();
	if (!endArrayCells) { chrono.chronoStart(); }
}

window.onclick = function () { clic("TRACKPAD"); }

function keydown(evt) {
	var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();
	switch (keyCode) {
		//Trackpad
        case 96: //zéro pavé numérique
           if (isStopped){ chrono.chronoStart() } else { chrono.chronoPause(); }
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

DURATION = 100
isScrolling = false
function animateScroll (a, b) {
	frameTime = 1/FPS*1000
	bugScroll = a+b<((TOTALCELLS-2)*CELLHEIGHT-20)
	if (!isScrolling && bugScroll){
		timer = setInterval(function () {
			isScrolling = true;
			document.body.scrollTop += b/(DURATION/frameTime)
			if ((b>0 && document.body.scrollTop>a+b)
			|| (b<0 && document.body.scrollTop<a+b)) { 
				isScrolling = false
				clearInterval(timer)
			}
		},frameTime)
	}
}