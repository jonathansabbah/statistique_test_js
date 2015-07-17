var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
fetch.Promise = require('bluebird');
var mongo = require('./mongo');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
// else the response is will be always {authenticate: false}
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.send({authenticate: false});
  }
}

module.exports = function() {
  router.post('/data', isAuthenticated, function(req, res) {
    var params = req.body;
    var successData = mongo.saveData(
      params.device,
      params.taille,
      params.orientation,
      params.data
    );
  });
  return router;
}

//=========================== functions ===================================

// function getTypeform(token, typeformId, callback) {
//   fetch(
//     'https://api.typeform.com/v0/form/'
//     + typeformId
//     + '?key='
//     + token //put user token here
//     + '&completed=true'
//   ).then(function(response) {
//     return response.json();
//   }).then(function(json) {
//     callback(json);
//   }).catch(function(ex) {
//     callback(false, ex);
//   });
}