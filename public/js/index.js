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

/**
 * Not used currently.
 * These 2 sprites would both belong to the same enemy,
 * with a different one being chosen each tick, 
 * as a sort of rudimentary animation.
 */
const alienSprite2a1 = document.getElementById("enemy02a01");
const alienSprite2a2 = document.getElementById("enemy02a02");

// Game parameters
const alienMargin = 40; // alien.w + 10
const maxAliensPerRow = 10;
const maxAlienRows = 5; // maximum amount of rows on screen at any given time
const verticalJump = 40; // how far down a row moves (alien.h + 10)

// game inits
let aliens = []; // Store all living aliens
let alienCurrentRow = 1;
let runOnce = true;
let rightMostAlien = 0;
let leftMostAlien = 0;
let alienSpeed = 0.5;
let alienDirection = 1; // positive = move to the right; negative = move to the left

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
  w: 4,
  h: 20,
  x: player.x,
  y: player.y - player.h,
  speed: -10,
  dy: -10
};

const Alien = (aX, aY) => {
  const alien = {};
  alien.w = 30;
  alien.h = 30;
  alien.x = aX;
  alien.y = aY;
  alien.isHit = false;
  return alien;
};

function drawPlayer(){
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

//only call this function at game start
function createAlienRow(){
  console.log("start of createAlienRow(). runOnce=" + runOnce);
  console.log("alienCurrentRow in createAlienRow: " + alienCurrentRow);
  let newAlien = {};
  if(aliens.length < 10*alienCurrentRow && alienCurrentRow <= maxAlienRows){
    for(let i = 0; i < maxAliensPerRow; i++){
      newAlien = Alien((i*alienMargin), (verticalJump*alienCurrentRow)-verticalJump);
      aliens.push(newAlien);
      console.log("newAlien added to aliens[]. aliens.length = " + aliens.length);
    }
  }
  if(alienCurrentRow <= maxAlienRows){alienCurrentRow++;}
  else if(alienCurrentRow > maxAlienRows){
    runOnce = false;
    console.log("end of createAlienRow(). runOnce=" + runOnce);
  }
}

function drawAliens(){
  for(let i = 0; i < aliens.length; i++){
    ctx.drawImage(alienSprite1, aliens[i].x, aliens[i].y, aliens[i].w, aliens[i].h);
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

function newPos(){
  player.x += player.dx;

  detectWalls();
  moveAliens();
}

function moveAliens(){
  for(let alien of aliens){
    alien.x += alienSpeed*alienDirection;

    if(alienDirection > 0){
      if(alien.x + alien.w > rightMostAlien){
        rightMostAlien = alien.x + alien.w;
      }
      if(alien.x > leftMostAlien){
        leftMostAlien = alien.x;
      }
    }
    else{
      if(alien.x + alien.w < rightMostAlien){
        rightMostAlien = alien.x + alien.w;
      }
      if(alien.x < leftMostAlien){
        leftMostAlien = alien.x;
      }
    }
  }

  // if the any alien collides with a wall: all aliens jump down...
  if((rightMostAlien >= canvas.width && alienDirection > 0) ||
    (leftMostAlien <= 0 && alienDirection < 0)){
      for(let alien of aliens){
        alien.y += verticalJump;
      }
      //... and change direction!
      alienDirection *= -1;
    }
}

function alienCollision(){

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

  if(runOnce){createAlienRow()};

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
  if(e.key === "Space" || e.key === "Up" || e.key === "ArrowUp"){
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