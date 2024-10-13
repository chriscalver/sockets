var express = require("express");
var app = express();
var http = require("http");
var cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
// var server = app.listen(process.env.PORT || 8080, listen);
// var server = app.listen(8080, listen);
app.use(express.static("public"));

// var io = require('socket.io')(server);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.sockets.on(
  "connection",
  // We are given a websocket object in our function
  function (socket) {
    console.log("We have a new client: " + socket.id);

    socket.on("mouse", function (data) {
      // Data comes in as whatever was sent, including objects
      console.log("Received: 'mouse' " + data.x + " " + data.y);
      // Send it to all other clients
      socket.broadcast.emit("mouse", data); // send to everyone including sender
      // socket.emit('mouse', data);    // send to sender only
    });

    socket.on("message", function (data) {
      console.log("Received: 'message' " + data);
      // Send it to all other clients
      socket.broadcast.emit("message", data); // send to everyone including sender
      // socket.emit('mouse', data);    // send to sender
    });

    socket.on("disconnect", function () {
      console.log("Client has disconnected");
    });
  }
);

server.listen(8080, () => {
  console.log("listening on *:8080");
});

// This call back just tells us that the server has started
// function listen() {
//   var host = server.address().address;
//   var port = server.address().port;
//   // Check if the host is '::' and replace it with 'localhost'
//   if (host === "::") {
//     host = "localhost";
//   }
//   console.log("Example app listening on port 8080");
// }
