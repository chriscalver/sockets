var express = require("express");
var app = express();
var http = require("http");
var cors = require("cors");
const { Server } = require("socket.io");
const { emit } = require("process");
app.use(cors());
const server = http.createServer(app);
app.use(express.static("public"));
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];
let tempUser = "";

io.sockets.on("connection", function (socket) {

  socket.on("sendName", function (data) {
    tempUser = data;
    console.log("Received: 'sendName' " + data);
  });

  console.log("We have a new client: " + tempUser);
  // users.push({
  //   playerName: tempUser,
  //   playerPosition: "not selected",
  //   socketId: socket.id,
  // });
  console.log(users);

  socket.on("mouse", function (data) {
    console.log("Received: 'mouse' " + data.x + " " + data.y);
    socket.broadcast.emit("mouse", data); // send to everyone except sender
    // socket.emit('mouse', data);    // send to sender only
  });

  socket.on("message", function (data) {
    console.log(data);
    socket.broadcast.emit("message", data); // send to everyone except sender
    //  socket.emit("message", data);    // send to sender only
  });

  socket.on("addNewUser", function (data) {
    console.log(data + " has joined the chat");
    if (users.some((user) => user.playerName === data)) {
      console.log("user already exists");
      socket.emit("userExists", data);
    } else {
      users.push({
        playerName: data,
        playerPosition: "not selected",
        socketId: socket.id,
      });
      console.log(users);
      socket.broadcast.emit("userAdded", data); // send to everyone except sender
      io.sockets.emit('userStatus', users); // send to everyone
      // io.sockests.emit("userStatus", users); // send to eveyone
      // io.sockets.emit('users_count', clients);
      //  socket.emit("message", data);    // send to sender only
    }
  });

  socket.on("disconnect", function (data) {
    console.log(data);
    // users.pop();
    if (users.length === 0) {
      console.log("no users");
      return;
    } else {
      console.log("users exist");
      let userIndex = users.findIndex((user) => user.socketId === socket.id);
      console.log(users[userIndex].playerName + " has disconnected");
      users = users.filter((user) => user.socketId !== socket.id);
      io.sockets.emit('userStatus', users); // send to everyone
    }
    // console.log("has disconnected");
    console.log(users);
  });
});

server.listen(8080, () => {
  console.log("listening on port 8080");
});
