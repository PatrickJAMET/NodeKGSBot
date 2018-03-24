
//var request             = require('request');

var KGSHandler          = require("./handler");
var config              = require("./config");

var xhrc                = require("xmlhttprequest-cookie");
var XMLHttpRequest      = xhrc.XMLHttpRequest;
var CookieJar           = xhrc.CookieJar;

var url_ = "http://gokgs.com/json/access";
//var url_ = "http://localhost/access";

var handler = new KGSHandler(config);

//var c = new con(config, handler.handleMessage );
//handler.connect();





