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
const alienMargin = 50; // alien.w + 10 = 50
const maxAliensPerRow = 10;
const maxAlienRows = 5; // maximum amount of rows on screen at any given time
const verticalJump = 50; // how far down a row moves (alien.h + 10)

// game inits
let aliens = []; // Store all alive aliens
let alienRowCounter = 0;
let runOnce = false;
let newAlien = {};

let testArray = [
  {
    x: 11,
    y: 22,
    z: 33

  }
];

const TestMe = (tX, tY, tZ) => {
  const testMe = {};
  testMe.x = tX;
  testMe.y = tY;
  testMe.z = tZ;
  return testMe;
};
 
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

function fillTestArray(){
  let newTest = {};
  let x = 0;
  let y = 1;
  let z = 2;
  console.log("fillTestArray start. testArray.length = " + testArray.length);
  if(testArray.length < 3){
    for(let i = 0; i < 3; i++){
      x += i;
      y += i;
      z += i;
      newTest = TestMe(x, y, z);
      console.log("newTest created");
      console.log("newTest.x = " + newTest.x + " newTest.y = " + newTest.y +" newTest.z = " + newTest.z);
      testArray.push(newTest);
      console.log("newTest pushed to testArray. testArray.length = " + testArray.length);
    }
  }
  console.log("entering for loop")
  for(let tester in testArray){
    console.log("loop number: " + tester);
    console.log(testArray[tester]);
  }
  console.log("end of fillTestArray function");
  runOnce = true;
}

// Creates aliens as distinct objects
//@TODO: clean up comments rewrite to make this actually work
function createAlienRow() {
  if(aliens.length < 10){
    for (let i = 1; i < maxAliensPerRow + 1; i++) {
      //ctx.drawImage(alienSprite1, (alien.x + i*alienMargin), alien.y, alien.w, alien.h);
      newAlien = (alien) => {
        alien.w,
        alien.h,
        (alien.x + i * alienMargin),
        alien.y,
        alien.speed,
        alien.dx,
        alien.dy;
      };
      aliens.push(newAlien);
      console.log("new alien added. aliens.length = " + aliens.length);
      console.log("newAlien.x = " + newAlien.x)
    }
  }
  
}

//@TODO: figure out how to return an object from aliens[]
function drawAliens(){
  for(let alien in aliens){
    ctx.drawImage(alienSprite1, aliens[alien].x, aliens[alien].y, aliens[alien].w, aliens[alien].h);
    // console.log("alien= " + alien);
    // console.log("alien.x = " + " " + aliens[alien].x + "alien.y = " + aliens[alien].y + "alien.w = " + aliens[alien].w + "alien.h = " + aliens[alien].h);
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
  player.y += player.dy;

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

 // drawAliens();

  drawPlayer();
  //if((testArray.length) < 2){testArray.fillTestArray();} 
  if(!runOnce){fillTestArray();}
  // fillTestArray();

  // createAlienRow();
  //initAliens();
  //checkAliens();

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