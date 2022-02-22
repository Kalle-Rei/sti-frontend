//index.js

// age();

// function age() {
//   let xhr = new XMLHttpRequest();
//   //xhr.open("GET", "/js/data.json");
//   //xhr.open("GET", "http://localhost:3001/football");
//   //xhr.open("GET", "http://kalle-backend.herokuapp.com/football");
//   //xhr.open("GET", "http://kalle-backend.herokuapp.com/hypnosismic")
//   xhr.onload = function () {
//     let data = JSON.parse(this.response);
//     createTable(data);
//   };
//   xhr.send();
// }

// Start of Space invaders code

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("source");
const alienSprite1 = document.getElementById("enemy01");

// Game parameters
// @TODO: possibly add more variables for vertical movement and tracking leftmost/rightmost alien here
const alienMargin = 50; // space between each alien
const maxAliensPerRow = 10;


const player = {
  w: 50,
  h: 70,
  x: (canvas.width - 50)/2, // 50 == player.w
  y: canvas.height,
  speed: 5,
  dx: 0,
  hasFired: false
};

const playerBullet = {
  w: 5,
  h: 20,
  x: player.x,
  y: player.y,
  speed: -10,
  dx: 0,
  dy: -10
};

const alien = {
  w: 40,
  h: 40,
  x: 0,
  y: 0,
  speed: 5,
  dx: 0,
  dy: 0
};

function drawPlayer(){
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

function drawAlienRow(){
  for(let i = 1; i < maxAliensPerRow + 1; i++){
    ctx.drawImage(alienSprite1, (alien.x + i*alienMargin), alien.y, alien.w, alien.h);
  }
}

function drawPlayerBullet(){
  if(!player.hasFired){
    playerBullet.x = player.x;
  }
  ctx.fillStyle = "#333";
  ctx.fillRect(playerBullet.x, playerBullet.y, playerBullet.w, playerBullet.h);
}

function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function playerBulletNewPos(){
  playerBullet.y += playerBullet.dy;
  playerBulletDetectCollision();
}

function playerBulletDetectCollision(){
  if(playerBullet.y < 0){
    player.hasFired = false;
    ctx.clearRect(playerBullet.x, playerBullet.y, playerBullet.w, playerBullet.h);
    console.log("Collision detected. player.hasFired = " + player.hasFired);
    console.log("playerBullet.y = " + playerBullet.y);
    playerBullet.y = player.y;
    console.log("Reset playerBullet.y. New value: " + playerBullet.y);
  }
}

function newPos(){
  player.x += player.dx;

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
}

function update(){
  clear();

  drawPlayer();

  drawAlienRow();

  if(player.hasFired){
    drawPlayerBullet();
    playerBulletNewPos();
  }

  newPos();

  requestAnimationFrame(update);
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
  else if(e.key === "Space" || e.key === "Up" || e.key === "ArrowUp"){
    drawPlayerBullet();
    player.hasFired = true;
    console.log("Pressed " + e.code + ", player.hasFired = " + player.hasFired);
    console.log("playerBullet.y = " + playerBullet.y);
  }
}

function keyUp(e){
  if(
    e.key == "Right" ||
    e.key == "ArrowRight" ||
    e.key == "Left" ||
    e.key == "ArrowLeft"
  ){
    player.dx = 0;
  }
}

update();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);