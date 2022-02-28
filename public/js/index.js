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
const topMargin = 40; // leave the top of the canvas free in order to display currentScore and player.lives there

//@TODO: make score and player.lives visible to the user at the top of the screen

// game inits
let aliens = []; // Store all living aliens
let alienCurrentRow = 1; // Used to generate aliens. Increments by 1 per row, to a maximum value of maxAlienRows
let runOnce = true;
let rightMostAlien = 0;
let leftMostAlien = 0;
let alienSpeed = 0.5;
let alienDirection = 1; // positive = move to the right; negative = move to the left
let currentScore = 0;
let playing = true;
let maxAlienBullets = 3; // maximum amount of alien projectiles on the screen at any given time
let alienBullets = []; // store all active alienBullets

//@TODO: refactor player and playerBullet to look and work like Alien and AlienBullet
const player = {
  w: 50,
  h: 70,
  x: (canvas.width - 50)/2, // 50 == player.w
  y: canvas.height,
  speed: 5,
  dx: 0,
  dy: 0,
  hasFired: false,
  lives: 3  // the player can survive 3 hits before game over -- any extra lives left at the end will work as a score multiplier
};

const playerBullet = {
  w: 3.5,
  h: 20,
  x: player.x,
  y: player.y - player.h,
  dy: -8
};

const Alien = (aX, aY) => {
  const alien = {};
  alien.w = 30;
  alien.h = 30;
  alien.x = aX;
  alien.y = aY;
  alien.isHit = false;
  alien.points = 10;  //@TODO: refactor this if/when additional types of aliens are added
  alien.isShooting = false;
  return alien;
};

const AlienBullet = (bX, bY) => {
  const alienBullet = {};
  alienBullet.w = 2.5;
  alienBullet.h = 16;
  alienBullet.x = bX;
  alienBullet.y = bY; // might need to be tweaked
  alienBullet.dy = 6;
  return alienBullet;
}

function drawPlayer(){
  ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

//only call this function at game start
function createAliens(){
  console.log("start of createAliens(). runOnce=" + runOnce);
  console.log("alienCurrentRow in createAliens: " + alienCurrentRow);
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
    console.log("end of createAliens(). runOnce=" + runOnce);
  }
}

//@TODO: increase hardcoded margins slightly as soon as all other systems are in place and functioning
function aliensToShoot(){
  for(let alien of aliens){
    // nested if-statements for the sake of readability

    // aliens that are already shooting need not apply
    if(!alien.isShooting){  
      // check if the alien occupies a similar position on the x-axis as the player does
      //@TODO: tweak these numbers and move them to global variables
      if((alien.x - 40) <= player.x && (alien.x + alien.w + 40) >= player.x){
          
        //@TODO: implement a check for the y-axis here, to ensure that only 1 alien per column will get isShooting=true

        // the chance for an alien to fire is random, but increases as the total number of aliens decrease
        if(alienChanceToShoot() <= 2){
          alien.isShooting = true;
        }
      }
    }
  }
  alienShootBullet();
}

// Generates an alienBullet, pushes it to alienBullets[], and calls drawAlienBullets()
function alienShootBullet(){
  let newAlienBullet = {};
  for (let alien of aliens){
    if(alien.isShooting && alienBullets.length < maxAlienBullets){
      newAlienBullet = AlienBullet(alien.x, alien.y);
      alienBullets.push(newAlienBullet);
      //console.log("Alien fired bullet. alienBullets.length=" + alienBullets.length);
      alien.isShooting = false;
    }
    else if(alien.isShooting && alienBullets.length >= maxAlienBullets){
      alien.isShooting = false;
    }
  }
}

//@TODO: if new alien sprites are added the hardcoded values used here need to be refactored
function drawAlienBullet(){
  for(let i = 0; i < alienBullets.length; i++){
    ctx.fillStyle = "#333";
    // 30 == alien.h, 15 == alien.x/2
    ctx.fillRect(alienBullets[i].x + 15, alienBullets[i].y + 30, alienBullets[i].w, alienBullets[i].h);
  }
}

function alienBulletNewPos(){
  for(let i = 0; i < alienBullets.length; i++){
    alienBullets[i].y += alienBullets[i].dy;
    alienBulletDetectCollision();
  }
}

function alienBulletDetectCollision(){
  for(let i = 0; i < alienBullets.length; i++){
    if(alienBullets[i].y + alienBullets[i].h > canvas.height){
      //console.log("alienBullet hit lower wall at y=" + alienBullets[i].y);
      alienBullets.splice(i, 1);
      //console.log("alienBullet removed. alienBullets.length=" + alienBullets.length);
    }
    else if(
      alienBullets[i].y + alienBullets[i].h >= player.y && 
      alienBullets[i].x >= player.x &&
      alienBullets[i].x + alienBullets[i].w <= player.x + player.w){
        console.log("the player has been hit by an alienBullet");
        alienBullets.splice(i, 1);
        player.lives--;
        console.log("player.lives=" + player.lives);
      }
  }
}

function alienChanceToShoot(){
  if(aliens.length >= 35){
    return (Math.floor(Math.random() * 10)); // return a number between 1 and 10
  }
  else if(aliens.length < 35 && aliens.length >= 20){
    return (Math.floor(Math.random() * 6)); // return a number between 1 and 6
  }
  else{
    return (Math.floor(Math.random() * 4)); // return a number between 1 and 4
  }
}

//@TODO: this will need rewriting if more than 1 alien sprite is in use
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
  if(playerBullet.y < -playerBullet.h){ // check if the bullet has travelled past the top wall
    player.hasFired = false;
    ctx.clearRect(playerBullet.x, playerBullet.y, playerBullet.w, playerBullet.h);
    //console.log("Collision detected. player.hasFired = " + player.hasFired);
    resetPlayerBullet();
  }
  else{
    for(let alien of aliens){

      // @TODO: might be a good idea to make alien hitboxes smaller to make hitting them harder. Alternatively the bullet could get smaller

      // check if bullet is on the same x as an alien
      if(playerBullet.x + playerBullet.w >= alien.x &&
        playerBullet.x <= alien.x + alien.w){
          // check if the bullet has the same y position as any alien with the same x
          if(playerBullet.y >= alien.y && playerBullet.y - playerBullet.h <=
            alien.y){
              player.hasFired = false;
              alien.isHit = true;
              // not sure if this is the best place to call checkAliens(), but calling it in update() seems wasteful
              checkAliens();  
              ctx.clearRect(playerBullet.x, playerBullet.y, playerBullet.w, playerBullet.h);
              //console.log("Collision with alien detected. player.hasFired = " + player.hasFired);
              resetPlayerBullet();
            }
        }
    }
  }
}

function resetPlayerBullet(){
  //console.log("playerBullet.y = " + playerBullet.y);
  playerBullet.y = player.y;
  //console.log("Reset playerBullet.y. New value: " + playerBullet.y);
}

// finds and handles aliens hit by the player
function checkAliens(){
  for (let i = 0; i < aliens.length; i++){
    if(aliens[i].isHit){
      //@TODO: possibly move score calculations to its own function
      currentScore += aliens[i].points;
      console.log("Score increased. currentScore=" + currentScore);
      aliens.splice(i, 1);  //remove any alien with isHit == true from aliens[]
      console.log("checkAliens() removed an alien w/ index " + i + " from aliens[]");
    }
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

function win(){
  //@TODO: logic that fires after all aliens are dead
  console.log("GAME WON -- all aliens defeated");
  playing = false;
  currentScore *= player.lives;
}

function lose(){
  //@TODO: logic that fires when player.lives = 0
  console.log("GAME OVER -- all lives lost");
  playing = false;
}

function gameOver(){
  if(player.lives <= 0){
    player.lives = 0;
    lose();
    //@TODO: erase aliens, the player and all bullets from the canvas, and display currentScore
    //@TODO: create a button that allows the player to start a new game 
  }
  if(aliens.length === 0){
    if(player.lives <= 1){player.lives = 1;} // make sure the score calculations work even if player.lives gets weird values
    win();
  }
}

function update(){
  clear();

  drawPlayer();

  if(runOnce){createAliens()};

  if(!(aliens.length === 0)){drawAliens();}
  if(alienBullets.length < maxAlienBullets){aliensToShoot();} // set aliens to shoot as long as there isn't more than maxAlienBullets on screen
  if(alienBullets.length > 0){
    drawAlienBullet();
    alienBulletNewPos();
  }

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
  if((e.key === "Space" || e.key === "Up" || e.key === "ArrowUp") && !player.hasFired){
    drawPlayerBullet();
    player.hasFired = true;
    //console.log("Pressed " + e.code + ", player.hasFired = " + player.hasFired);
    //console.log("playerBullet.y = " + playerBullet.y);
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