module.exports = {
	drawCells: drawCells,
}

// —————————————————————————————————————————————————————————————————————————————
// Draw
// —————————————————————————————————————————————————————————————————————————————
function drawCells (cellNumber) {
	var cells = document.getElementById('cells')
	//Centrage
	offsetX = (document.body.clientWidth-CELLWIDTH)/2;
	offsetY = (1440-cellHeight)/2;
	cells.width = offsetX+CELLWIDTH
	cells.height = 2*offsetY+cellHeight*TOTALCELLS
	pixelSize = cellHeight / 2.5

	var cell = cells.getContext('2d');
	
	for (var i = TOTALCELLS-1; i >= 0; i--) {
		cell.beginPath();
		cell.rect(offsetX,offsetY+i*cellHeight, CELLWIDTH, cellHeight);

		//Couleur
		cell.fillStyle = (cellNumber==-i+Math.floor(TOTALCELLS/2))? "rgba(245,166,35,100)": "rgba(195,131,26,100)";
		cell.fill();

		//Contours
		cell.lineWidth = 1;
		cell.strokeStyle = 'black';
		cell.stroke();

		//Numéro
		cell.font = pixelSize+"px Helvetica";
		var gradient = cell.createLinearGradient(0,0,cells.width,0);
		gradient.addColorStop("0","white");
		gradient.addColorStop("1.0","white");
		cell.fillStyle = gradient;
		cell.textAlign = "center"
		text = -i+Math.floor(TOTALCELLS/2)+""
		textX = offsetX + (CELLWIDTH/2)
		textY = offsetY + (i*cellHeight) + (cellHeight/2+pixelSize/3)
		cell.fillText(text,textX,textY);
	};
}

function Top (darkzone) { return parseInt(darkzone.style.top.replace("px",""))}