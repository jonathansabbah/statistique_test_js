var mongoose = require('mongoose')
module.exports = {
	initDatabase: initDatabase,
	saveData: saveData,
}

// —————————————————————————————————————————————————————————————————————————————
// Mongo
// —————————————————————————————————————————————————————————————————————————————
initDatabase()

function initDatabase () {
  mongoose.connect('mongodb://localhost/db', function(err) {
    if (err) { throw err; }
  });
}

var dataModel = mongoose.model('data', new mongoose.Schema(
	{
	  device : String,
	  taille: Number,
	  orientation: String,
	  data : 
	    [{
	      distance : Number,
	      temps: String
	    }]
	} 
))

function saveData (device,taille,orientation,data) {
	new dataModel({
	  device: device,
	  taille: taille,
	  orientation: orientation,
	  data: data
	}).save(function (err) {
	  if (err) {  console.log("Echec de l'ajout des données"); return false;  }
	  console.log('Données ajoutées avec succès !');
	  return true;
	});
}