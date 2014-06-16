// Create Chatterbox app

// create namespace for our app
// retrieve chat messages from server

var app = {};

app.getMessages = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    success: function(data) {
      console.log('data: ', data);
    }
  });
};

$(document).ready(function () {
  app.getMessages();
});

// ensure safe escaping for all incoming data
// continually retrieve them in order somehow
