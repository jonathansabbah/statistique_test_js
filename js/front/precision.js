module.exports = { 
	precisionCheck: precisionCheck,
	saveAndResetPrecisionTime: saveAndResetPrecisionTime,
}
// —————————————————————————————————————————————————————————————————————————————
// Test de Precision
// —————————————————————————————————————————————————————————————————————————————

function precisionCheck () {
	if (precisionFirstPassage){
		if (ARRAYCELLS[currentCellToGet] >= 0 && cellNumber >= ARRAYCELLS[currentCellToGet]
			|| ARRAYCELLS[currentCellToGet] < 0 && cellNumber <= ARRAYCELLS[currentCellToGet]) {
			precisionStartTime = new Date()
			precisionFirstPassage = false
		}
	}
}

function saveAndResetPrecisionTime () {
	precisionFirstPassage = true
	if (precisionStartTime != -1) {	
		precision = new Date() - precisionStartTime
		precisionStartTime = -1
		return precision
	}
}