var xhrc          = require("xmlhttprequest-cookie");
var XMLHttpRequest = xhrc.XMLHttpRequest;
var KGSHandler           = require("./handler");


// Are we currently logged in?
var isLoggedIn = false;

function Connection(config,  env){


  this.login = config.login;
  this.password = config.password;
  this.isLoggedIn = false;
  this.url = config.url;

  //this.handler = new KGSHandler();
  this.handle = env;

  
}


Connection.prototype.connect = function(){
  var login_information = {
    "type": "LOGIN",
    "name": this.login,
    "password": this.password,
    "locale": "en_US"
  };

  this.send(login_information);
}


Connection.prototype.send = function(json){
  var _this = this;
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        console.log("Upload success: type = " + json.type);
        if (json.type == "LOGIN") {
          // After our login message has been sent, we kick off the first download operation to see the result.
          // After this first download call, each download will automatically trigger the next,
          // so we won't need to call this again.
          _this.isLoggedIn = true;
          _this.downloadKgsMessage();
        }
      } else {
        // Upload failed. We'll just report it to the user. This is to help debugging, in a finished client you would
        // want to hide this.
        // The responseText is a big error page from your JSP system, but all KGS error messages have the format
        // ":KGS: error text :KGS:", which makes it easy to extract that with a regex. If the error is in that format,
        // we extract the error; otherwise we show the whole report.
        var errorText = req.responseText;
        var matcher = /:KGS: (.*?) :KGS:/.exec(errorText);
        if (matcher) {
          errorText = matcher[1];
        }
        console.log("Error, status: "+req.status+" - error: "+errorText);// + ", response text = " + req.responseText);

      }
    }
    else{
        //console.log("upload failure: readyState = "+req.readyState+" Status = " + req.status);// + ", response text = " + req.responseText);

      }
    }
    req.open("POST",this.url,true);
  req.setRequestHeader("content-type", "application/json;charset=UTF-8"); // Make sure Unicode is used.
  req.send(JSON.stringify(json));
}

Connection.prototype.downloadKgsMessage = function(){
  var req = new XMLHttpRequest();
  var _this = this;
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      //var jsonOut = document.getElementById("jsonOut");
      if (req.status == 200) {
        //console.log("Download success: readyState = "+req.readyState+", Status = " + req.status);// + ", response text = " + req.responseText);

        response = JSON.parse(req.responseText);

        // We'll append this message to the HTML to show what came back.
        //jsonOut.innerHTML = jsonOut.innerHTML + "<br>" + escapeHtml(JSON.stringify(response, null, 2))
        
        //console.log(req.responseText);
          //downloadKgsMessage();

        //console.log(JSON.stringify(response, null, 2));
        if (response.messages) {
          // After 1 minute with no message, we'll time out and get an "empty" response. We only want to do the
          // forEach here if the response has content.
          for (let message of response.messages) {
          _this.handle.handleMessage.call(_this.handle, message);
          }
        }

        if (_this.isLoggedIn) {
          // If we are still logged in, then download another message.
          _this.downloadKgsMessage();
        }
      }
      else {
        // Show the response as an error message. Don't fetch another message, we're done.
        //console.log("Download failure: readyState = "+req.readyState+", Status = " + req.status );//+ ", response text = " + req.responseText);

        //jsonOut.innerHTML = jsonOut.innerHTML + "<br>" + escapeHtml(req.responseText);
        isLoggedIn = false;
        console.log("restart loggin ?");
      }
    }
    else {
        //console.log("Download failure: readyState = "+req.readyState+" Status = " + req.status );//+ ", response text = " + req.responseText);
    }
  };
  req.open("GET", this.url, true);
  req.send();
}




module.exports = Connection;