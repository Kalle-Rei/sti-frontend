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
const alienMargin = 50; // alien.w + 10
const maxAliensPerRow = 10;
const maxAlienRows = 5; // maximum amount of rows on screen at any given time
const verticalJump = 50; // how far down a row moves (alien.h + 10)

// game inits
let aliens = []; // Store all alive aliens
let alienCurrentRow = 1;

const player = {
  w: 50,
  h: 70,
  x: (canvas.width - 50)/2, // 50 == player.w
  y: canvas.height,
  speed: 5,
  dx: 0,
  dy: 0,
  hasFired: false
};

const playerBullet = {
  w: 5,
  h: 20,
  x: player.x,
  y: player.y - player.h,
  speed: -10,
  dy: -10
};

const Alien = (aX, aY) => {
  const alien = {};
  alien.w = 40;
  alien.h = 40;
  alien.x = aX;
  alien.y = aY;
  alien.speed = 5;
  alien.dx = 0;
  alien.isHit = false;
  return alien;
};

function drawPlayer(){
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

//@TODO: add logic for creating additional rows below the first one
function createAlienRow(){
  console.log("alienCurrentRow in createAlienRow: " + alienCurrentRow);
  let newAlien = {};
  if(aliens.length < 10*alienCurrentRow && alienCurrentRow <= 5){ //@TODO: remove this condition; it's only a temporary bandaid during testing
    for(let i = 0; i < maxAliensPerRow; i++){
      newAlien = Alien((i*alienMargin), (verticalJump*alienCurrentRow)-50);
      aliens.push(newAlien);
      console.log("newAlien added to aliens[]. aliens.length = " + aliens.length);
    }
  }
  if(alienCurrentRow <= 5){alienCurrentRow++;}
}

function drawAliens(){
  for(let i = 0; i < aliens.length; i++){
    ctx.drawImage(alienSprite1, aliens[i].x, aliens[i].y, aliens[i].w, aliens[i].h);
    // console.log("alien drawn at x=" + aliens[i].x + " y="+aliens[i].y);
  }
}

function drawPlayerBullet(){
  if(!player.hasFired){
    playerBullet.x = player.x + player.w/2;
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
  if(playerBullet.y < -20){ // check against the inversion of playerBullet.h 
    player.hasFired = false;
    ctx.clearRect(playerBullet.x, playerBullet.y, playerBullet.w, playerBullet.h);
    console.log("Collision detected. player.hasFired = " + player.hasFired);
    console.log("playerBullet.y = " + playerBullet.y);
    playerBullet.y = player.y;
    console.log("Reset playerBullet.y. New value: " + playerBullet.y);
  }
}

//@TODO: update alien position from here as well
function newPos(){
  player.x += player.dx;
  //player.y += player.dy;

  detectWalls();
}

function detectWalls() {
  //upper wall
  if (player.y < 0) {
    player.y = 0;
  }
  //lower wall
  if (player.y + player.h > canvas.height) {
    player.y = canvas.height - player.h;
  }
  //left wall
  if (player.x < 0) {
    player.x = 0;
  }
  //right wall
  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
  }
}

function update(){
  clear();

  drawPlayer();

  createAlienRow();

  if(!(aliens.length === 0)){drawAliens()};

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