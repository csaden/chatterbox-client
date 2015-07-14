// YOUR CODE HERE:
// retrieve all the rooms in chatterbox


var app = {};


app.init = function() {
  app["user"] = window.prompt("What's your name?");  
  app.fetch(app.getRoomNames);
};

app.getRoomNames = function(data){

  app.rooms = _.uniq(_.map(data.results, function(message) { return message.roomname;}));
  for (var i = 0; i < app.rooms.length; i++){
    var room = document.createElement("option");
    // set value and text
    if (app.rooms[i]) {
      room.setAttribute("value", app.rooms[i]);
      room.setAttribute("class", "room");
      room.innerHTML = app.rooms[i];
      $("#roomSelect").append(room);
    }
  }

  app["currentRoom"] = $(".room").val();

};

$(".submit-button").on("click", function(event){
  event.preventDefault();
  console.log("hello");
  var message = {
      username: app.user,
      text: $(".message-content").val(),
      roomname: app.currentRoom,
      // createdAt: (new Date()).toJSON()
    };
});

app.clearMessages = function() {
  _.each($("#chats").children(), function(elem) {
    elem.remove();
  });
};

app.addMessage = function(message) {

    var messageElement = document.createElement("div");
    messageElement.setAttribute("class", "message");
    
    var username = document.createElement("h3");
    username.appendChild(document.createTextNode(message.username));

    var messageText = document.createElement("p");
    messageText.appendChild(document.createTextNode(message.text));

    var createdAt = document.createElement("span");

/*    var time = moment((new Date()).toJSON()).fromNow();
    time = document.createTextNode(time);
    createdAt.appendChild(time);*/
    
    messageElement.appendChild(username);
    messageElement.appendChild(messageText);
    // messageElement.appendChild(createdAt);
    //console.log(message);
    $("#chats").append(messageElement);

};

app.addRoom = function(roomName) {
  var room = document.createElement("option");
  room.setAttribute("class", "room");
  room.setAttribute("value", roomName);
  room.innerHTML = roomName;
  $("#roomSelect").append(room);
};

app.send = function(message) {

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'json',
    success: function() {
      console.log("chaterbox: Message sent");
    },
    error: function () {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  //debugger;
};

app.showMessage = function(data){

  var filteredData = [];
  filteredData = _.filter(data.results, function(message) { 
    return !!message.hasOwnProperty("roomname");// && message.roomname === app.currentRoom; 
  });
  
  for (var i = 0; i<filteredData.length; i++){
    var message = filteredData[i];
    
    var messageElement = document.createElement("div");
    messageElement.setAttribute("class", "message");
    
    var username = document.createElement("h3");
    username.appendChild(document.createTextNode(message.username));

    var messageText = document.createElement("p");
    messageText.appendChild(document.createTextNode(message.text));

    var createdAt = document.createElement("span");

    var time = moment(message.createdAt).fromNow();
    time = document.createTextNode(time);
    createdAt.appendChild(time);
    

    messageElement.appendChild(username);
    messageElement.appendChild(messageText);
    messageElement.appendChild(createdAt);
    //console.log(message);
    $("#chats").append(messageElement);
  }
};


app.fetch = function() {

  var cb = arguments[0] || app.showMessage;

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

};

app.init();
app.fetch();
// setInterval(function(){
//   // update our display of messages
//   app.fetch();
// }, 2000);
