var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "");
//establish connection to chat DB


//Make User, Messages, Room Models

var User = sequelize.define('users', {
 name: Sequelize.STRING,
 id: Sequelize.INTEGER,
 created_at: Sequelize.INTEGER,
 updated_at: Sequelize.INTEGER
},{
  timestamps: false
});

var Room = sequelize.define('rooms', {
  name: Sequelize.STRING,
  id: Sequelize.INTEGER
},{
  timestamps: false
});

var Message = sequelize.define('messages', {
  text: Sequelize.STRING,
  id: Sequelize.INTEGER,
  room_id: Sequelize.INTEGER,
  user_id: Sequelize.INTEGER,
  created_at: Sequelize.INTEGER,
  updated_at: Sequelize.INTEGER
},{
  timestamps: false
});

User.hasMany(Message);
Message.belongsTo(User);

Room.hasMany(Message);
Message.belongsTo(Room);


User.sync();
Room.sync();
Message.sync();


var db = {

  getMessages: function(cb, roomId) {
     Message.findAll({
      where: {
        room_id: roomId
      }
     }).complete(function(err, messages){
      if ( err ) console.log(err);
      cb( messages )
     });
  },

  getRooms: function(cb) {
    Room.findAll().complete(function(err, rooms) {
      if ( err ) console.log(err);
      cb( rooms );
    });
  },

  createUser: function(username, cb) {
    User.findOrCreate({
      where: { name: username }
    }).complete(function(err, user) {
      if ( err ) console.log(err);
      cb( user );
    });
  },

  createMessage: function(text, roomId, userId) {
     // return dbConnection.query('INSERT INTO messages SET ?', { text: text, room_id:roomId, user_id: userId })
     //   .then(function(result){ // insert the user and return the id
     //   return dbConnection.query('SELECT * from messages WHERE id=' + result[0].insertId)
     //   .then(function(result) {
     //      return result[0][0];
     //   });
     // });
  },

  createRoom: function(roomName) {
    Room.findOrCreate({
      where: { name: roomName }
    }).complete(function(err, room) {
      if ( err ) console.log(err);
      cb( room );
    });

  }

};

// db.createUser('anon', function(user){ console.log('user is :' , user )});

// db.getRooms(function(rooms){ console.log(rooms) });

db.getMessages(function(messages){ console.log(messages) }, 2);


module.exports = db;

