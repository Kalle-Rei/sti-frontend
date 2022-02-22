//app.js
const express = require("express");
let favicon = require("serve-favicon");
let path = require("path");
const res = require("express/lib/response");

const PORT = process.env.PORT || 3000;

const app = express();
app.use("/healthcheck", require("./routes/healthcheck.routes"));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// app.get("/football", function (req, res) {
//   res.sendFile(__dirname + "/public/index.html");
// });

// app.get("/hypnosismic", function (req, res) {
//     res.sendFile(__dirname + "/public/index.html");
// });

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});

// Start of Space invaders code

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("source");
const player = {
  w: 50,
  h: 70,
  x: 20,
  y: 200,
  speed: 5,
  dx: 0,
  dy: 0
};

function drawPlayer(){
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos(){
  player.x += player.dx;
  player.y += player.dy;

  detectWalls();
}

function detectWalls(){
  //left wall
  if(player.x < 0){
    player.x = 0;
  }
  //right wall
  if(player.x + player.w > canvas.width){
    player.x = canvas.width - player.w;
  }
  //upper wall
  if(player.y < 0){
    player.y = 0;
  }
  //lower wall
  if(player.y + player.h > canvas.height){
    player.y = canvas.height - player.h;
  }
}

function update(){
  clear();

  drawPlayer();

  newPos();

  requestAnimationFrame(update);
}

function moveUp(){
  player.dy = -player.speed;
}

function moveDown(){
  player.dy = player.speed;
}

function moveLeft(){
  player.dx = -player.speed;
}

function moveRight(){
  player.dx = player.speed;
}

function keyDown(e){
  if(e.key === "ArrowRight" || e.key === "Right"){
    moveRight();
  }
  else if(e.key === "ArrowLeft" || e.key === "Left"){
    moveLeft();
  }
  else if(e.key === "ArrowDown" || e.key === "Down"){
    moveDown();
  }
  else if(e.key === "ArrowUp" || e.key === "Up"){
    moveUp();
  }
}

function keyUp(e){
  if(
    e.key == "Right" ||
    e.key == "ArrowRight" ||
    e.key == "Left" ||
    e.key == "ArrowLeft" ||
    e.key == "Up" ||
    e.key == "ArrowUp" ||
    e.key == "Down" ||
    e.key == "ArrowDown"
  ){
    player.dx = 0;
    player.dy = 0;
  }
}

update();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);