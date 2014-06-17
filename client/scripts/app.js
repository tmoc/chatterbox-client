// Create Chatterbox app

// create namespace for our app
// retrieve chat messages from server

var app = {};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {order: '-createdAt'},
    success: function(data) {
      console.log('fetch success: ', data)
      app.processMessages(data.results);
    },
    error: function(data){
      console.log('fetch failure', data);
    }
  });
};
// create a send method for chat app
  // submit via ajax the user's input
  // refocus on the text field
  // display new message on success
  // produce an error message on failed input
app.processMessages = function (messages) {
  app.rooms = {};
  console.log(messages);
  //iterate over messages
  for( var i = messages.length - 1; i >= 0; i-- ) {
    //add each roomname to rooms object
    app.addRoom(_.escape(messages[i].roomname));
    //filter by roomname and display them
    if( (_.escape(messages[i].roomname) === app.currentRoom) && (!app.receivedMessages[messages[i].objectId]) ){
      app.addMessage(messages[i]);
      app.receivedMessages[messages[i].objectId] = true;
    }
  }
  app.populateRooms();
};

app.send = function (message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('send success: ', data);
      $('#chatText').val('');
      app.fetch();
    },
    error: function(data){
      console.log('send failure', data);
    }
  });
};

app.addRoom = function(roomname) {
  app.rooms[roomname] = true;
};

app.createMsgObj = function(){
  //create an empty object with properties:
  var currentText = $('#chatText').val();
  var messageToSend = {
    //username
    'username': app.username,
    //text
    'text': currentText,
    //roomname
    'roomname': app.currentRoom
  };
  return messageToSend;
};

app.addMessage = function(message){
  var msgStr = '<li>';
  msgStr += _.escape(message.username) + ': ' + _.escape(message.text);
  msgStr += '<br>&emsp;&emsp; // createdAt: ' + _.escape(message.updatedAt);
  msgStr += '<br>&emsp;&emsp; // objectId: ' + _.escape(message.objectId);
  msgStr += '</li>';
  app.$messageContainer.append(msgStr);
  //remove any messages after a cap of 20
  var msgList = app.$messageContainer.children();
  if( msgList.length >= 20 ){
    msgList.first().remove();
  }
};

app.populateRooms = function(){
  var option;
  app.$roomSelect.empty();
  _.each(app.rooms, function(value, key){
    option = '<option value="' + key + '">' + key + '</option>';
    app.$roomSelect.append(option);
  });
  app.$roomSelect.val(app.currentRoom);
};

app.clearMessages = function(){
  app.$messageContainer.empty();
};

app.init = function () {
  app.currentRoom = 'lobby';
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.rooms = {};
  app.receivedMessages = {};
  app.$messageContainer = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.username = prompt("What's your username?");
  app.fetch();
};


$(document).ready(function () {
  app.init();

  $('#submit').click(function(){
    app.send(app.createMsgObj());
  });

  $('#submitRoom').click(function () {
    app.currentRoom = $('#currentRoom').val();
    app.fetch();
  });

  app.$roomSelect.change(function(){
    app.clearMessages();
    app.receivedMessages = {};
    app.currentRoom = app.$roomSelect.val();
    app.fetch();
  });
});

// ensure safe escaping for all incoming data
// continually retrieve them in order somehow
