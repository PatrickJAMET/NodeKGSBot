var con                 = require("./connection");

// The .bind method from Prototype.js 
if (!Function.prototype.bind) { // check if native implementation available
  Function.prototype.bind = function(){ 
    var fn = this, args = Array.prototype.slice.call(arguments),
        object = args.shift(); 
    return function(){ 
      return fn.apply(object, 
        args.concat(Array.prototype.slice.call(arguments))); 
    }; 
  };
}

function KGSHandler(config){
  //setup stuff
  this.friends = {};
  this.rooms = {};
  this.games = {};
  this.chats = {};

  // setup the connection

  var c = new con(config, this);
  c.connect();

};



KGSHandler.prototype.handleMessage = function (message){
  var _this = this;
  console.log("Download success: type = " + message.type);
  if (message.type == "LOGOUT") {
    isLoggedIn = false;
    if (message.text) {
      //alert(message.text);
    }
  }
  if(message.type == "LOGIN_SUCCESS"){
    _this.handleLogin(message);
  }
  if(message.type == "ROOM_NAMES"){
    //console.log(JSON.stringify(message,null,2));
    for(room in message.rooms){
      //console.log(room);
      this.rooms[message.rooms[room].channelId] = {"name":message.rooms[room].name};
    }
    //console.log(this.rooms);
  }
  if(message.type == "ROOM_JOIN"){
    if(this.rooms.hasOwnProperty(message.channelId)){
      for( game in message.games){
        this.games[message.games[game].channelId] = message.games[game];
        console.log(this.rooms[message.channelId].name +": "+ message.games[game].gameType);
      }
    }
  }
  if(message.type == "GAME_LIST"){
    if(this.rooms.hasOwnProperty(message.channelId)){
      for( game in message.games){
        this.games[message.games[game].channelId] = message.games[game];
        console.log(this.rooms[message.channelId].name +": "+ message.games[game].gameType);
      }
    }
    //console.log(JSON.stringify(message,null,2));
  }
}

KGSHandler.prototype.handleLogin = function(message){
  //console.log(JSON.stringify(message,null,2));
  //var obj = JSON.parse(result);
  var keys = Object.keys(message);
  for (var i = 0; i < keys.length; i++) {
    console.log(keys[i]);
  }
}




module.exports = KGSHandler;