// YOUR CODE HERE:

var app = function(){
  var app =  {};

  app.friends = {
  };

  app.users = {
    anon: {
      name: 'anon',
      id: 1
    }
  }

  app.rooms = {
    lounge: {
      name: 'lounge',
      id: 1
    }
  };

  app.settings = {
    chatContainer: '#chats',
    roomSelect: '#roomSelect',
    defaultUser: app.users.anon,
    defaultRoom: app.rooms.lounge,
    currentUser: undefined,
    currentRoom: app.rooms.lounge,
    endpoints: {
      messages: 'http://localhost:3000/classes/messages',
      rooms: 'http://localhost:3000/classes/rooms',
      users: 'http://localhost:3000/classes/users'
    }
  };


  app.currentMessages = {};

  app.init = function() {
    $(document).ready(function(){
      $('#userselect').addClass('show');
      app.addGlobalListeners();
      app.addMessageListeners();
      app.getRooms();
    });
  };


  app.getRooms = function() {
    this.fetch(app.settings.endpoints.rooms, function(rooms) {
      for ( var i = rooms.length - 1; i >= 0; i-- ) {
        app.rooms[rooms[i].name] = rooms[i].id;
      }
      var selector = $('#roomSelect select');
      selector.empty();
      for ( var k in app.rooms ) {
        var name = Array.prototype.slice.call(k, 0, 20).join('');
        var option = $('<option></option>');
        option.text(name).val(app.rooms[k])
        if ( app.settings.currentRoom.id === app.rooms[k].id ) {
          option.prop('selected', true)
        }
        selector.append(option);
      }
      selector.append('<option disabled>-----</option><option value="create">Create a Room</option>');
    });
  };

  app.createUser = function(name) {
    if( !name.trim().length ) {
      name = app.settings.defaultUser.name;
    }
    var obj = { name: name };
    $.ajax({
      url: app.settings.endpoints.users,
      type: 'POST',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      success: function(data) {
        app.users[name] = {
          name: name,
          id: data.id
        };
        app.settings.currentUser = app.users[name];
      },
      error: function(data) {
        console.log('chatterbox: Failed to create new user record');
      }
    })
  };

  app.createRoom = function(roomName) {
    if( !roomName.trim().length ) {
      roomName = app.settings.defaultRoom.name;
    }
    var obj = { name: roomName };
    $.ajax({
      url: app.settings.endpoints.rooms,
      type: 'POST',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      success: function(data) {
        app.rooms[roomName] = {
          name: roomName,
          id: data.id
        };
        app.settings.currentRoom = app.rooms[roomName];
        app.getRooms();
      },
      error: function(data) {
        console.log('chatterbox: Failed to create new user record');
      }
    })
  };

  app.send = function(message) {
    $.ajax({
      url: app.settings.endpoints.messages,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        message.objectId = data.objectId;
        message.createdAt = data.createdAt;
        app.currentMessages[message.objectId] = message;
        app.addMessage(message);

      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  };

  app.fetch = function(url, callback) {
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        callback(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  };

  app.addMessage = function(message){
    var messageBody = $('<div class="message" data-post-id="' + message.objectId + '"><div><div class="username"></div><div class="message-room"></div></div><div class="message-body"></div><div class="time">' + moment(message.createdAt).startOf('hour').fromNow() + '</div></div>');
    messageBody.find('.message-body').text(message.text);
    messageBody.find('.username').text(message.username);
    messageBody.find('.message-room').text('posted in ' + message.roomname);
    $(app.settings.chatContainer).prepend(messageBody);
    this.addMessageListeners();
  };

  app.clearMessages = function(){
    $(app.settings.chatContainer).empty();
  };

  app.getNewMessages = function(room){
    room = room || app.settings.currentRoom;
    app.fetch(app.settings.endpoints.messages, function(messages){
      for (var i = messages.length - 1; i >= 0; i--){
        if ( !app.currentMessages[messages[i].objectId] ){
            app.currentMessages[messages[i].objectId] = messages[i];
            app.addMessage(messages[i]);
          }
      }
    });
  };

  app.addRoom = function(room){
    $(app.settings.roomSelect).append('<button id="' + room + '">' + room + '</button>');
  };

  app.addFriend = function(friend) {
    app.friends[friend] = {};
  };

  app.handleSubmit = function(){
    var message = {};
    message.userId = app.settings.currentUser.id || app.settings.defaultUser.id;
    message.text = $('#message textarea').val();
    message.roomId = app.settings.currentRoom.id;
    this.send(message);
    $('#message textarea').val("");
  };

  app.addGlobalListeners = function() {

    // submit form by AJAX
    $('#message').submit(function(e){
      e.preventDefault();
      app.handleSubmit();
    });

    $('#fetch').on('click', function(e){
      app.getNewMessages();
    });

    $('#clear').on('click', function(e){
      app.clearMessages();
    });

    $('#userselect form').on('submit', function(e) {
      e.preventDefault();
      var newUser = $(this).find('input').val();
      app.createUser(newUser);
      $('#userselect.modal-container').removeClass('show');
    });

    $('#userselect .modal-close').click(function(e){
      e.preventDefault();
      app.currentUser = app.users.anon;
      $('#userselect.modal-container').removeClass('show');
    });

    $('#roomSelect select').change(function(){
      if ( $(this).val() === 'create' ) {
        $('#roomcreate').addClass('show');
      } else {
        app.settings.currentRoom = newRoom;
      }
    });

    $('#roomcreate form').on('submit', function(e) {
      e.preventDefault();
      var name = $(this).find('input').val();
      app.createRoom(name);
      $('#roomcreate').removeClass('show');
    });

  };

  app.addMessageListeners = function(){
    // add a friend!
    $('.username').click(function(){
      var friend = $(this).text();
      app.addFriend(friend);
    });
  }

  app.init();

  return app;
}();

