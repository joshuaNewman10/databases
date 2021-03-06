var express = require('express');
var serveStatic = require('serve-static');
var router = express.Router();
var app = express();
var Promise = require('bluebird');
var path = require('path');

var fs = require('fs');
var bodyParser = require('body-parser');

var db = Promise.promisifyAll(require('../Helpers/mysqlHelpers'));

app.use(bodyParser.json());

router.options('/messages', function(req, res, next) {
  res.status(200);
  res.send();
});

/* GET home page. */

//Get rooms
router.get('/rooms', function(req, res, next) {
   var data = {};

   db.getRooms()
   .then(function(result) {
     data.result = result;
     res.send(data);
   });
});

// Get log
router.get('/messages', function(req, res, next) {
  var data = {};

  db.getMessages()
    .then(function(result){
      data.result = result;
      res.send(data);
    });
});

// Get log descending
router.get('/messages/sortby/date/ascending', function(req, res, next) {
  var data = {};
  readLog(function(log) {
    data.results = log.messages.sort(function(a,b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    res.send(data);
  });
});

router.get('/arglebargle', function(req, res, next) {
  res.status(404);
  res.send('arglebargle');
});

// create a user or return an id
router.post('/users', function(req, res, next) {
  var data = {};
  var name = req.body.name;
  db.createUser(name)
  .then(function(id) {
    data.id = id;
    res.status(201);
    res.send(data);
  });
});

router.post('/rooms', function(req, res, next) {
  var data = {};
  var roomName = req.body.name;
  db.createRoom(roomName)
    .then(function(id) {
      data.id = id;
      res.status(201);
      res.send(data);
  });
});

// POST message
router.post('/messages', function( req, res, next ) {
  var data = {};
  var text = req.body.text;
  var roomId = req.body.roomId;
  var userId = req.body.userId;
  db.createMessage(text, roomId, userId)
    .then(function(data) {
      res.status(201);
      res.send(data);
  });
});

module.exports = router;
