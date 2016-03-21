var express = require("express");
var backEnd = require('./back-end/index.js');

/* Front End Static Hosting */
var frontEnd = express();

console.log("Starting FrontEnd on port 8000");
frontEnd.use(express.static(__dirname + '/front-end'));
frontEnd.listen(8000);

/* Start back end node server */
backEnd()

/* TODO: Start MAX on Macs */
