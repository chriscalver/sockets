var express = require('express');
// Create the app
var app = express();
// process.env.PORT is related to deploying on heroku
// var server = app.listen(process.env.PORT || 3000, listen);
var server = app.listen(8080, listen);


// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;  
  // Check if the host is '::' and replace it with 'localhost'
  if (host === '::') {
    host = 'localhost';
  }  
  console.log('Example app listening on port 8080');
}
app.use(express.static('public'));

// WebSockets work with the HTTP server
var io = require('socket.io')(server);
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {  
    console.log("We have a new client: " + socket.id);  
    // When this user emits, client side: socket.emit('otherevent',some data);
    
    socket.on('mouse',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'mouse' " + data.x + " " + data.y);      
        // Send it to all other clients
        socket.broadcast.emit('mouse', data);  // send to everyone including sender        
        // socket.emit('mouse', data);    // send to sender only
      }
    );    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);