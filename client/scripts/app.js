// YOUR CODE HERE:
// retrieve all the rooms in chatterbox


var app = {};

app.getRoomNames = function(data){

  app.rooms = _.uniq(_.map(data.results, function(message) { return message.roomname;}));

  for (var i = 0; i < app.rooms.length; i++){
    var room = document.createElement("option");
    // set value and text
    room.setAttribute("value", app.rooms[i]);
    room.setAttribute("class", "room");
    room.innerHTML = app.rooms[i];
    $(".rooms-options").append(room);
  }

  app["currentRoom"] = app.rooms[0].roomname;

};

app.init = function() {
  app["user"] = window.prompt("What's your name?");  

  app.getData(app.getRoomNames);

  //app["currentRoom"] =
};

app.send = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: {
      username: app.user,
      text: "hi",
      roomname: "kitchen"
    },
    contentType: 'json',
    success: function() {
      console.log("chaterbox: Message sent");
    },
    error: function () {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.showMessage = function(data){

  var filteredData = [];
  filteredData = _.filter(data.results, function(message) { return message.roomname === app.currentRoom; });
  //debugger;
  for (var i = 0; i<filteredData.length; i++){
    var message = filteredData[i];
    
    var messageElement = document.createElement("div");
    messageElement.setAttribute("class", "message");
    
    var username = document.createElement("h3");
    username.appendChild(document.createTextNode(message.username));

    var messageText = document.createElement("p");
    messageText.appendChild(document.createTextNode(message.text));

    var createdAt = document.createElement("span");
    createdAt.appendChild(document.createTextNode(message.createdAt));
    username.appendChild(createdAt);

    messageElement.appendChild(username);
    messageElement.appendChild(messageText);
    //console.log(message);
    $("#main").append(messageElement);
  }
};


app.getData = function(cb){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    //data: JSON.stringify(message),
    contentType: 'jsonp',
    success: cb,
    error: function () {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

}

setInterval(function(){
  // update our display of messages
  app.getData(app.showMessage);

}, 2000);

app.init();
