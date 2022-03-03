//index.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("source");
const alienSprite1 = document.getElementById("enemy01");
const scoreForm = document.getElementById("scoreForm");
const scoreFormObject = document.forms["scoreForm"];
const UPDATE_FIRST = 0;
const UPDATE_INTERVAL = 5000;
let data = ["0", "0", "0", "0", "0"];

setTimeout(age, UPDATE_FIRST);
// AJAX engine
age();
function age(){
  var xhr = new XMLHttpRequest();
  // xhr.open("GET", "http://localhost:3001/highscores");
  xhr.open("GET", "https://kalle-backend.herokuapp.com/highscores")
  xhr.onload = function(){
    data = JSON.parse(this.response);
    createTable(data);
    setTimeout(age, UPDATE_INTERVAL);
  }
  xhr.send();
}

//@TODO: this is a hacky solution that doesn't even work. Needs to be rewritten
function createTable(data){
  var appElement = document.getElementById("gameOver");
  var aTable = document.createElement("table");
  appElement.appendChild(aTable);
  
  console.log("createTable. data.length=" + data.length);
  for (let i = 0; i < 5; i++) {
      aTable.appendChild(createRow(data[i].user, data[i].score));
      console.log(data[i].user +" " + data[i].score);
       
  }
}

function createRow(user, points){
  var aRow = document.createElement("tr");
  aRow.appendChild(createCell(user));
  aRow.appendChild(createCell(points));   
  return aRow;
}

function createCell(content){
  var aCell = document.createElement("td");
  aCell.innerHTML = content;
  return aCell;
}

/**
 * Not used currently.
 * These 2 sprites would both belong to the same enemy,
 * with a different one being chosen each tick, 
 * as a sort of rudimentary animation.
 */
// const alienSprite2a1 = document.getElementById("enemy02a01");
// const alienSprite2a2 = document.getElementById("enemy02a02");

// Game parameters
const alienMargin = 40;     // alien.w + 10
const maxAliensPerRow = 10; // default=10
const maxAlienRows = 5;     // maximum amount of rows on screen at any given time. default=5
const verticalJump = 40;    // how far down a row moves (alien.h + 10)
const topMargin = 40;       // leave the top of the canvas free in order to display currentScore and player.lives there

// aliens will try to shoot the player if their positition on the x-axis is player.w +- alienMarginOfError
const alienMarginOfError = 40;

// game inits
let aliens = [];          // Store all living aliens
let alienCurrentRow = 1;  // Used to generate aliens. Increments by 1 per row, to a maximum value of maxAlienRows
let runOnce = true;
let rightMostAlien = 0;
let leftMostAlien = 0;
let alienSpeed = 0.5;
let alienDirection = 1;   // positive = move to the right; negative = move to the left
let currentScore = 0;
let playerScore = 0;
let playing = true;
let maxAlienBullets = 3;  // maximum amount of alien projectiles on the screen at any given time. default=3
let alienBullets = [];    // store all active alienBullets
let playerName = "";      // the name that gets sent to the backend

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
  lives: 5  // the player can survive x hits before game over -- any extra lives left at the end will work as a score multiplier
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
  alien.points = 10;
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

function dynDrawScore(){
  document.getElementById("playerScore").innerHTML = currentScore;
  document.getElementById("playerLives").innerHTML = player.lives;
}

// only call this function at game start
function createAliens(){
  console.log("start of createAliens(). runOnce=" + runOnce);
  //console.log("alienCurrentRow in createAliens: " + alienCurrentRow);
  let newAlien = {};
  if(aliens.length < 10*alienCurrentRow && alienCurrentRow <= maxAlienRows){
    for(let i = 0; i < maxAliensPerRow; i++){
      newAlien = Alien((i*alienMargin), (verticalJump*alienCurrentRow)-verticalJump);
      aliens.push(newAlien);
      //console.log("newAlien added to aliens[]. aliens.length = " + aliens.length);
    }
  }
  if(alienCurrentRow <= maxAlienRows){alienCurrentRow++;}
  else if(alienCurrentRow > maxAlienRows){
    runOnce = false;
    console.log("end of createAliens(). runOnce=" + runOnce);
  }
}

// nested if-statements for the sake of readability
function aliensToShoot(){
  for(let alien of aliens){
    // aliens that are already shooting need not apply
    if(!alien.isShooting){  
      // check if the alien occupies a similar position on the x-axis as the player does
      if((alien.x - alienMarginOfError) <= player.x && (alien.x + alien.w + alienMarginOfError) >= player.x){
          
        //@TODO: possibly implement a check for the y-axis here, to ensure that only 1 alien per column will get isShooting=true

        // the chance for an alien to fire is random and increases as the total number of aliens decrease
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
      alienBullets.splice(i, 1);
    }
    else if(
      alienBullets[i].y + alienBullets[i].h >= player.y && 
      alienBullets[i].x >= player.x &&
      alienBullets[i].x + alienBullets[i].w <= player.x + player.w){
        alienBullets.splice(i, 1);
        player.lives--;
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
  if(playerBullet.y < -playerBullet.h){ // check if a playerBullet has travelled past the top wall
    player.hasFired = false;
    ctx.clearRect(playerBullet.x, playerBullet.y, playerBullet.w, playerBullet.h);
    resetPlayerBullet();
  }
  else{
    for(let alien of aliens){

      // check if playerBullet is on the same x as an alien
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
              resetPlayerBullet();
            }
        }
    }
  }
}

function resetPlayerBullet(){playerBullet.y = player.y;}

// finds and handles aliens hit by the player
function checkAliens(){
  for (let i = 0; i < aliens.length; i++){
    if(aliens[i].isHit){
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

  // if any alien collides with a wall: all aliens jump down...
  if((rightMostAlien >= canvas.width && alienDirection > 0) ||
    (leftMostAlien <= 0 && alienDirection < 0)){
      for(let alien of aliens){
        alien.y += verticalJump;
        if(alien.y + alien.h >= player.y){ // end the game if any alien reaches the player 
          console.log("the aliens have reached the player")
          player.lives = 0;
          gameOver();
        }
      }
      //... and change direction!
      alienDirection *= -1;
    }
}

function detectWalls() {
  if (player.y < 0) {                         // upper wall
    player.y = 0;
  }
  if (player.y + player.h > canvas.height) {  // lower wall
    player.y = canvas.height - player.h;
  }
  if (player.x < 0) {                         // left wall
    player.x = 0;
  }
  if (player.x + player.w > canvas.width) {   // right wall
    player.x = canvas.width - player.w;
  }
}

function win(){
  console.log("GAME WON -- all aliens defeated");
  currentScore *= player.lives;
  // submitHighScore(currentScore);
  setHighScore(currentScore);
}

function lose(){
  //logic that fires when player.lives = 0
  console.log("GAME OVER -- all lives lost");
  // submitHighScore(currentScore);
  setHighScore(currentScore);
}

function gameOver(){
  dynDrawScore(); // update score in the header so the player doesn't feel cheated
  playing = false;
  scoreForm.style.display = "block";
  canvas.style.background = "#333";
  if(player.lives <= 0){
    player.lives = 0;
    lose();
  }
  else if(aliens.length <= 0 && player.lives >= 1){
    win();
  }
}


//@TODO: send playerScore and playerName to the backend
function setHighScore(playerScore){
  scoreFormObject.elements["score"].value = playerScore;
}

//@TODO: currently broken and needs to be rewritten most likely
function submitHighScore(){
  // scoreFormObject.elements["score"].value = currentScore;
  currentScore = scoreFormObject.elements["score"].value;
  playerScore = currentScore; //@TODO: change this
  console.log("playerScore=" + playerScore + " currentScore=" + currentScore);
  //scoreFormObject.elements["score"].value = playerScore;
  var xhr = new XMLHttpRequest();
  playerName = scoreFormObject.elements["player_name"].value;
  console.log("getPlayerName() called. scoreFormObject.elements[player_name].value=" + playerName);
  //let data = {"user": playerName, "score": score}
  // let url ="http://localhost:3001/registerscore?user=" + playerName + "&score=" + playerScore;
  let url ="https://kalle-backend.herokuapp.com/registerscore?user=" + playerName + "&score=" + playerScore;
  xhr.open("GET", url);
  xhr.send();
}

function update(){
  clear();

  if(playing){
    drawPlayer();
    dynDrawScore();

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
    if(player.lives <= 0 || (aliens.length <= 0 && player.lives >= 1)){
      gameOver();
    }
  }
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