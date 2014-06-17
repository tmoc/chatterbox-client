// Create Chatterbox app

// create namespace for our app
// retrieve chat messages from server

var app = {};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    // order: '-createdAt',
    success: function(data) {
      //iterate over messages
      app.rooms = {};
      _.each(data.results, function(messageObj){
        //add each roomname to rooms object
        console.log('messageObj.roomname: ', messageObj.roomname);
        app.addRoom(messageObj.roomname);
        //filter by roomname and display them
        if( messageObj.roomname === app.currentRoom ){
          app.addMessage(messageObj);
        }
      });
      app.populateRooms();
    },
    error: function(data){
      console.log('failure', data);
    }
  });
};
// create a send method for chat app
  // submit via ajax the user's input
  // refocus on the text field
  // display new message on success
  // produce an error message on failed input

app.send = function (message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('success: ', data);
      $('#chatText').val('');
      app.fetch();
    },
    error: function(data){
      console.log('failure', data);
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
  var msgList = app.$messageContainer.children();
  console.log(msgList);
  var msgStr = '<li>';
  msgStr += _.escape(message.roomname) + '/' + _.escape(message.username) + ': ' + _.escape(message.text);
  msgStr += '</li>';
  console.log(msgStr);
  app.$messageContainer.append(msgStr);
  //remove any messages after a cap of 20
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
  debugger;
  app.currentRoom = 'lobby';
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.rooms = {};
  //THIS IS OUR ISSUE - CAN'T FIND SELECTOR FOR ID
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
    app.currentRoom = app.$roomSelect.val();
    app.fetch();
  });
});

// ensure safe escaping for all incoming data
// continually retrieve them in order somehow
