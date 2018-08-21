/* Express setup
**********************************/

// imports the npm module that is being used aka express here
var express = require('express');

var app = express();
// create local server on your pc on port 3000
var server = app.listen(3000);
// local server hosts all the 'static' files in the 'client_public' folder 
app.use(express.static('client'));

console.log("running");

/*socket.io setup
********************************************/
var socket = require('socket.io');
// io is an object that creates by the socket function
var io = socket(server);

io.sockets.on('connection', newPlayerJoined);

/* Function Definitions
********************************************/
function newPlayerJoined(){
	console.log('Welcome player! ' + socket.id);
}
 
