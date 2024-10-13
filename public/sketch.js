// Keep track of our socket connection
var socket;
let ellipses = [];
let IncomingMessage = "";
let OutgoingMessage = "";

let inputBox;
let submitButton;

function setup() {
  createCanvas(400, 500);
  background(0);

  // Start a socket connection to the server
  // socket = io.connect("http://chriscalver.com:8080");
  socket = io.connect("http://localhost:8080");

  // We make a named event called 'mouse' and write an anonymous callback function
  socket.on(
    "mouse",
    // When we receive data
    function (data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      noStroke();
      ellipse(data.x, data.y, 20, 20);
      ellipses.push({
        x: data.x,
        y: data.y,
        targetY: 490,
        color: color(0, 0, 255),
      });
      // IncomingMessage = "Someone added a circle";
    }
  );
  socket.on("message", function (data) {
    console.log("Got message: " + data);
    IncomingMessage = "Incoming Msg: " + data;
  });

  // Create an input box below the canvas
  inputBox = createInput("Enter text here");
  inputBox.position(30, height + 40); // Position it below the canvas

  // Create a button to the right of the input box
  submitButton = createButton("Submit");
  submitButton.position(inputBox.x + inputBox.width + 10, height + 40); // Position it next to the input box
  submitButton.mousePressed(handleSubmit); // Attach a callback function to handle button press

  // Clear input box text when clicked
  inputBox.mousePressed(() => {
    inputBox.value("");
  });

  // Make hitting Enter act like clicking the submit button
  inputBox.elt.addEventListener("keypress", (event) => {
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
  console.log("You Submitted: " + inputValue);
  OutgoingMessage = "You Said: " + inputValue;
  socket.emit("message", inputValue);
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
    targetY: 490,
    color: color(255, 255, 0),
  });
  // IncomingMessage = "You added a circle";
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
