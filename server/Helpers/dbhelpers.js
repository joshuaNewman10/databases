var mysql = require('mysql');
var Promise = require('bluebird');

//establish connection to chat DB


var dbConnection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'chat'
});

dbConnection.connect = Promise.promisify(dbConnection.connect);
dbConnection.query = Promise.promisify(dbConnection.query);

dbConnection.connect(function(err){ if (err) console.log(err); else console.log('DB connection established')});

var db = {

  checkForUser: function(username) {
    return dbConnection.query( 'SELECT * from users WHERE name="' + username + '" limit 1');
  },

  checkForRoom: function(roomName) {
    return dbConnection.query( 'SELECT * from rooms WHERE name="' + roomName + '" limit 1');
  },

  createUser: function(username) {
    return this.checkForUser(username).then(function(result){
      if ( !! result[0].length ) {
        return result[0][0].id;
      } else {
        return dbConnection.query('INSERT INTO users SET ?', { name: username })
          .then(function(result){ // insert the user and return the id
            return result[0].insertId;
        });
      }
    });

  },

  createMessage: function(text, roomId, userId) {
     return dbConnection.query('INSERT INTO messages SET ?', { text: text, room_id:roomId, user_id: userId })
       .then(function(result){ // insert the user and return the id
       return dbConnection.query('SELECT * from messages WHERE id=' + result[0].insertId)
       .then(function(result) {
          return result[0][0];
       });
     });
  },

  createRoom: function(name) {
     return this.checkForRoom(name).then(function(result) {
        console.log(result);
        if ( !! result[0].length ) {
          return result[0][0].id;
        } else {
          return dbConnection.query('INSERT INTO rooms SET ?', { name: name })
            .then(function(result){ // insert the user and return the id
               return result[0].insertId;
          });
        }
     })

  },

  getMessages: function(roomId, fromTime) {
     var query = 'SELECT * from messages where room_id =' + roomId;
     if ( fromTime ) {
       query += ' AND created_at > ' + fromTime;
     }
     query += ' ORDER BY id DESC';

     return dbConnection.query(query)
       .then(function(result) {
          return result[0];
       });
  },

  getRooms: function(all) {
    return dbConnection.query('SELECT * from rooms')
      .then(function(result) {
        return result[0];
      });
  }

};

// db.createUser('bob')
// .then(function(result) {
//   console.log(result);
// });

// db.createMessage('tons of text',1, 3)
// .then(function(result) {
//   console.log(result)});

// db.getMessages(1)
// .then(function(result) {
//   console.log(result)});

db.createRoom('lounge')
  .then(function(result){
    console.log('created the lounge, it\'s id is ' + result);
  });

db.createRoom('lobby')
.then(function(result){
  console.log('created the lobby, it\'s id is ' + result);
});

db.createRoom('lounge')
.then(function(result){
  console.log('tried to create another lounge, it\'s id is ' + result);
});

db.getRooms()
  .then(function(result) {
    console.log(result);
  });


module.exports = db;
