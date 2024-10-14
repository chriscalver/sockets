var express = require("express");
var app = express();
var http = require("http");
var cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
app.use(express.static("public"));

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
      console.log("Received: 'mouse' " + data.x + " " + data.y);    
      socket.broadcast.emit("mouse", data); // send to everyone except sender
      // socket.emit('mouse', data);    // send to sender only
    });

    socket.on("message", function (data) {
      console.log("Msg: " + data);
      socket.broadcast.emit("message", data); // send to everyone except sender
      //  socket.emit("message", data);    // send to sender only
    });

    socket.on("disconnect", function () {
      console.log("Client has disconnected");
    });
  }
);

server.listen(8080, () => {
  console.log("listening on *:8080");
});
