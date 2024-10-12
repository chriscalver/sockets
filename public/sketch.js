// Keep track of our socket connection
var socket;
let ellipses = [];

function setup() {
  createCanvas(300, 500);
  background(0);
  // Start a socket connection to the server

  socket = io.connect('http://chriscalver.com:8080');
  // socket = io.connect('http://localhost:8080');
  // We make a named event called 'mouse' and write an anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      // fill(255, 255, 0);
            noStroke();
      ellipse(data.x, data.y, 20, 20);
      ellipses.push({ x: data.x, y: data.y, targetY: 490, color: color(0,0,255) });
    }
  );
}

function draw() {
  background(0); // Clear the canvas with a background color

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

function mouseClicked() {
  // Draw some white circles
  // fill(25);
  // noStroke();
  // ellipse(mouseX, mouseY, 20, 20);
  // Send the mouse coordinates
  sendmouse(mouseX, mouseY);

  // Add the ellipse to the array with its initial and target positions
  ellipses.push({ x: mouseX, y: mouseY, targetY: 490, color: color(255, 255, 0) });
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  
  // Make a little object with x and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
