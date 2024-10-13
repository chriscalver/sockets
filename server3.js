var express = require('express');
var app = express();

// var server = app.listen(process.env.PORT || 8080, listen);
var server = app.listen(8080, listen);
app.use(express.static('public'));
var io = require('socket.io')(server);

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {  
    console.log("We have a new client: " + socket.id);  
        
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