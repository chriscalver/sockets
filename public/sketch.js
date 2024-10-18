var socket;
let ellipses = [];
let IncomingMessage = "";
let OutgoingMessage = "";
let manifest = "";
let inputBox;
let submitButton;
let incomingBubble = false;
let outgoingBubble = false;
let headerBubble = true;
let player1 = "Anonymous";
let player2 = "Anonymous";
let users = [];
let userHeader = "Users Connected: ";
let userNames = [];
let position =  180;

let userName = prompt("Please enter your name:");
if (userName) {
  // player1 = userName;
  localStorage.setItem("userName", userName);
  manifest = `Welcome to the P5.js Socket.IO Chat App, ${userName}!`;
}

function setup() {
  createCanvas(1000, 500);
  // createCanvas(500, 500);
  background(0);
  textSize(18);
  textFont("Arial");
  socket = io.connect("https://chriscalver.com:8080");
  // socket = io.connect("http://localhost:8080");
  
  
  socket.on("connect", function () {
    console.log("Connected");
    socket.emit("addNewUser", userName);
    // socket.emit("addNewUser", localStorage.getItem("userName"));
  });

  socket.on("userStatus", function (data) {
    console.log(data);
    userNames = []; // Reset the array to avoid duplicates
    for (let i = 0; i < data.length; i++) {
      userNames.push(data[i].playerName);
    }
    console.log("Users " + userNames.join(", "));

    // userNames = data.map((user) => user.playerName).join(", ");
  });
  socket.on("mouse", function (data) {
    console.log("Got: " + data.x + " " + data.y);
    // Draw a blue circle
    noStroke();
    ellipse(data.x, data.y, 20, 20);
    ellipses.push({
      x: data.x,
      y: data.y,
      targetY: 550,
      color: color(0, 0, 255),
    });
    // IncomingMessage = "Someone added a circle";
  });
  socket.on("message", function (data) {
    console.log(data);
    IncomingMessage = data;
    incomingBubble = true;
  });

  socket.on("playerName", function (data) {
    console.log(data);
    player2 = data;
  });

  socket.on("userAdded", function (data) {
    users.push({
      playerName: data,
      playerPosition: users.length == 1 ? "Player 2" : "Player 1",
    });
    console.log(users);
    // Store the user's name in the socket object
    socket.userName = data;
    // socket.broadcast.emit("userAdded", data); // send to everyone except sender
    //  socket.emit("message", data);    // send to sender only    
  });

  socket.on("disconnect", function () {
    console.log(socket.userName + " has disconnected");
    // Find the index of the user with the matching player name
    const userIndex = users.findIndex(
      (user) => user.playerName === socket.userName
    );
    // Remove the user if found
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
    }
    console.log(users);
  });

  socket.on("userExists", function () {
    console.log("User already exists");
    alert("User already exists");
    userName = prompt("Please enter your name:"); ///  help!!!!!!!!!!!!!!!!!!!!!!!
    manifest = `Welcome to the P5.js Socket.IO Chat App, ${userName}!`;
    socket.emit("addNewUser", userName);
  });


  inputBox = createInput("Enter text here");
  inputBox.position(30, height + 40); // Position it below the canvas
  submitButton = createButton("Submit");
  submitButton.position(inputBox.x + inputBox.width + 10, height + 40); // Position it next to the input box
  submitButton.mousePressed(handleSubmit); // Attach a callback function to handle button press
  inputBox.mousePressed(() => {
    // Clear input box text when clicked
    inputBox.value("");
  });
  inputBox.elt.addEventListener("keypress", (event) => {
    // Enter act like clicking thebutton
    if (event.key === "Enter") {
      handleSubmit();
    }
  });
}

function draw() {
  background(0); // Clear the canvas with a background color
  textFont("Arial");
  fill("white");
  textSize(18);
  text(IncomingMessage, 35, 55);
  text(OutgoingMessage, 235, 155);
  
  background(0);
  if (headerBubble) {
    fill(1, 133, 225); // text color blue 
    noStroke();
    text(manifest, 20, 20, 250, 100);
    text(userHeader, 20, 130);    
// make the following text dynamic
// lets view the following text vertically
for (let i = 0; i < userNames.length; i++) {
  text(userNames[i], 20, position + i * 20);
}

    
  }
  if (outgoingBubble) {
    noStroke();
    fill(255, 255, 255); // text color white
    text(userName + " said: " + OutgoingMessage, 20, 375);
    noStroke();
  }
  if (incomingBubble) {
    noStroke();
    fill(255, 255, 255); // text color white
    text(IncomingMessage, 20, 255);
    noStroke();
  }
  // Update and draw each ellipse
  for (let i = 0; i < ellipses.length; i++) {
    let e = ellipses[i];
    if (e.y < e.targetY) {
      e.y += 5; // Adjust the speed of the animation here
    }
    fill(e.color);
    noStroke();
    ellipse(e.x, e.y, 20, 20);
  }
}

function handleSubmit() {
  let inputValue = inputBox.value();
  console.log(userName + " Submitted: " + inputValue);
  OutgoingMessage = inputValue;
  socket.emit("message", userName + " said: " + inputValue);
  // socket.emit("playerName", userName);
  outgoingBubble = true;
  inputBox.value("");
}

function mouseClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  sendmouse(mouseX, mouseY);
  // Add the ellipse to the array with its initial and target positions
  ellipses.push({
    x: mouseX,
    y: mouseY,
    targetY: random(490, 400),
    color: color(255, 255, 0),
  });
}
// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  // Make a little object with x and y
  var data = {
    x: xpos,
    y: ypos,
  };
  // Send that object to the socket
  socket.emit("mouse", data);
}
