// Keep track of our socket connection
var socket;
let ellipses = [];
let IncomingMessage = "";
let OutgoingMessage = "";
let manifest = "Welcome to the P5.js Socket.IO Chat App";
let inputBox;
let submitButton;
let incomingBubble = false;
let outgoingBubble = false;
let headerBubble = true;
let userInput; // Define userInput as a global variable

window.onload = function() {
  showCustomPrompt();
};

function setup() {
  createCanvas(1200, 600);
  background(0);
  textSize(18);
  textFont("Arial");

  // Start a socket connection to the server
  socket = io.connect("http://localhost:8080");

  socket.on("mouse", function (data) {
    console.log("Got: " + data.x + " " + data.y);
    noStroke();
    ellipse(data.x, data.y, 20, 20);
    ellipses.push({
      x: data.x,
      y: data.y,
      targetY: 490,
      color: color(0, 0, 255),
    });
  });

  socket.on("message", function (data) {
    console.log("Got message: " + data);
    IncomingMessage = "Anonymous: " + data;
    incomingBubble = true;
  });

  inputBox = createInput("Enter text here");
  inputBox.position(30, height + 40);

  submitButton = createButton("Submit");
  submitButton.position(inputBox.x + inputBox.width + 10, height + 40);
  submitButton.mousePressed(handleSubmit);

  function handleSubmit() {
    OutgoingMessage = inputBox.value();
    socket.emit("message", OutgoingMessage);
    outgoingBubble = true;
    inputBox.value("");
  }

  inputBox.mousePressed(() => {
    inputBox.value("");
  });

  inputBox.elt.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  });
}

function showCustomPrompt() {
  const customPrompt = document.getElementById("custom-prompt");
  const customPromptInput = document.getElementById("custom-prompt-input");
  const customPromptOk = document.getElementById("custom-prompt-ok");
  const customPromptCancel = document.getElementById("custom-prompt-cancel");

  customPrompt.style.display = "flex";

  customPromptInput.addEventListener("input", () => {
    customPromptOk.disabled = customPromptInput.value.trim() === "";
  });

  customPromptOk.addEventListener("click", () => {
    userInput = customPromptInput.value;
    customPrompt.style.display = "none";
  });

  customPromptCancel.addEventListener("click", () => {
    window.location.href = "http://chriscalver.com";
  });
}

function draw() {
  background(0);

  if (headerBubble) {
    fill(1, 133, 225);
    noStroke();
    text(manifest, 20, 20, 250, 100);
  }

  if (outgoingBubble) {
    text(OutgoingMessage, 20, 375);
    noStroke();
  }

  if (incomingBubble) {
    text(IncomingMessage, 20, 255);
    noStroke();
  }

  fill(255);
  textSize(32);
  text(userInput, 50, 50);

  for (let i = 0; i < ellipses.length; i++) {
    let e = ellipses[i];
    if (e.y < e.targetY) {
      e.y += 5;
    }
    fill(e.color);
    noStroke();
    ellipse(e.x, e.y, 20, 20);
  }
}