module.exports = { 
	chronoPause: chronoPause,
	chronoStart: chronoStart,
	chronoReset: chronoReset,
	displayTime: displayTime
}

// —————————————————————————————————————————————————————————————————————————————
// Chrono
// —————————————————————————————————————————————————————————————————————————————
var timerID = 0

function displayTime (sec, decisec) {
	secFormatized = ((sec+"").length == 1)? "0"+sec : sec
	decisecFormatized = ((decisec+"").length == 1)? "0"+decisec : decisec
	return secFormatized + ":" + decisecFormatized
}

function chrono(){
	timerID = setInterval(function () {
		decisec++
		decisec = decisec % 100
		if (decisec == 99) {  sec++ };
		sec = sec % 60
		document.getElementById("chronotime").innerHTML = displayTime(sec,decisec)
	}, 10)
}

function chronoStart(){ 
	chrono(); 
	isStopped = false;
}

function chronoPause(){ 
	clearInterval(timerID); 
	isStopped = true;
}

function chronoReset(){ 
	clearInterval(timerID); 
	sec = 0; decisec = 0; 
	document.getElementById("chronotime").innerHTML = displayTime(sec,decisec); 
	isStopped = true;
}