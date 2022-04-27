let hub_hm,mg_hm,hub_bg,mg_bg,coin,lock;
let gamestate;
let p;
let time;
let begin;
let playing = false;
let firstgame = true;
let coins = [];
let mgpoints;
let points
let temp;
let noiseLocation = 0;


function preload() {

//bgs and hitmaps
    hub_hm = loadImage('images/hitmaps/hubhitmapwdoors.png');
    mg_hm = loadImage('images/hitmaps/mghitmap.png');
    hub_bg = loadImage('images/bgs/bghubwdoors.png');
    mg_bg = loadImage('images/bgs/bgmg.png');
//misc assets
    coin = loadImage('images/misc/coin.png');
    lock = loadImage('images/misc/lock.png');
}

function setup() {
    createCanvas(800,600);
    
//set gamestate
    gamestate=4;
    points = 0;
    p = new Player(60,402);
    setInterval(timer, 1000);
    
    for( let i = 0; i < 6; i++){
            temp = new mgCoin();
            coins.push(temp);
            coins[i].setPos();
    }
    noiseDetail(24);
}

function draw() { 
    
// switch statement with game state - each corresponds to a different "screen"
  switch(gamestate){
      case 0:
          startScreen();
          break;
      case 1:
          hubScreen();
          break;
      case 2:
          levelOne();
          break;
      case 3:
          levelTwo();
          break;
      case 4:
          miniGame();
          break;
      case 5:
          bossLevel();
          break;
      case -100:
          debug();
          break;
  }
}

function keyPressed(){
    //console.log(keyCode);
}
function mousePressed(){
    //console.log(mouseX,mouseY);
}

//debug screen
function debug(){
    p.display();
    p.move();
}

//levels screens 
function startScreen(){

}

function hubScreen(){
    hitmap = hub_hm;
    image(hitmap,0,0);
    image(hub_bg,0,0);
    noStroke();
    fill(200,150,100,200)
    rect(0,0,width,30);
    fill(0);
    text("total points: "+points,20,20);
    text("hover mouse over doors to see where they'll take you",120,20);
    text("press up arrow to enter a door",500,20);
    p.display();
    p.move();
}

function levelOne(){
    
    
}

function levelTwo(){
    
    
}

function miniGame(){
    // timer that controls game inspired by sample code: https://editor.p5js.org/denaplesk2/sketches/ryIBFP_lG
    //click to begin
    hitmap = mg_hm;
    image(hitmap,0,0);
    fill(0);
    rect(0,0,width,height);
    if(mouseIsPressed && !playing){
        playing = true;
        mgpoints=0;
        setTimer();
    }
    if(keyIsDown(13)){
        gamestate = 1;
    }
    //game is being played
    if(playing){
        image(mg_bg,0,0);
        fill(0,200);
        rect(0,0,width,40);
        fill(255);
        text(mgpoints+' points', 20, 25);
        text('Press Return to Quit',300,25);
        if (time >= 10) {
        text("time: 0:" + time, 70, 25);
      }
        if (time < 10 && time > 0) {
        text('time: 0:0' + time, 70, 25);
      }
        if (time == 0) {
        playing = false;
        firstgame = false;
        }
        p.display();
        p.move();
        for(let i = 0; i < coins.length; i++){
            coins[i].display();
       }
    }
    
    //game is over
    else if(firstgame){
        fill(255);
        text("mini game",380,260);
        text("objective: grab as many coins as you can before the time runs out!",220,300);
        text("click to begin",373,340);
        text('Press return to Quit', 355,400);
    }
    else{
        fill(255)
        text('Game Over. Click Again to Play', 330,300);
        text('Points: '+mgpoints, 390,340);
        text('Press Return to Quit', 355,400);
    }
    
}

function timer() {
  if (time > 0) {
    time--;
  }
}
function setTimer(){
   time = 30; 
}

function bossLevel(){
    
    
}

//player class prototype
class Player{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 25;
        this.ySpeed = 0;
        this.gravity = 0.3;
        this.findPlayerBounds();
        this.locked = false;
    }
    display(){
        fill(0,255,0);
        rect(this.x, this.y, this.size, this.size);
        // draw sensors
        fill(0,0,255);
        ellipse(this.left, this.middleY, 5, 5);
        ellipse(this.right, this.middleY, 5, 5);
        ellipse(this.middleX, this.up, 5, 5);
        ellipse(this.middleX, this.down, 5, 5);
    }
    findPlayerBounds(){
        this.left = this.x - 3;
        this.right = this.x + this.size + 3;
        this.up = this.y - 3;
        this.down = this.y + this.size + 3;
        this.middleX = this.x + this.size/2;
        this.middleY = this.y + this.size/2;
    }
    move(){
        //compute our current sensor position
        this.findPlayerBounds();

        // handle fall / jump movement
        this.handleFallJumpMovement();
        this.handleDoorMovement();
        
        if(keyIsDown(65) || keyIsDown(37)){
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x -= 3;
              }
        }
        if(keyIsDown(68) || keyIsDown(39)){
           // only all movement if the next pixel is not solid
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x += 3;
            }
        }
        if (keyIsDown(32) && this.isPixelSolid(this.middleX, this.down)) {
          this.ySpeed = -10;
          if(gamestate == 4){
              this.ySpeed = -40;
          }
        }
    }
    handleFallJumpMovement() {
        // apply gravity to our y Speed
        this.ySpeed += this.gravity;

        // adjust our y position based on our y Speed
        this.y += this.ySpeed;

        // speed limit!
        this.ySpeed = constrain(this.ySpeed, -10, 10);

        // moving down?
        if (this.ySpeed > 0) {
          // check the pixel below us. if it's solid, we need to stop!
          if (this.isPixelSolid(this.middleX, this.down)) {
            this.ySpeed = 0;

            // move us up to the pixel right above the thing we landed on that
            // isn't solid
            for (let i = this.down; i > 0; i--) {
              // test this color
              let testColor = this.isPixelSolid(this.middleX, i);

              // if it's not solid we can stop here!
              if (testColor == false) {
                this.y = i - this.size;
                break;
              }
            }
          }
        }
        // moving up?
        if (this.ySpeed < 0) {
          // check the pixel above us. if it's solid, we need to stop!
          if (this.isPixelSolid(this.middleX, this.up)) {
            this.ySpeed = 0;

            // move us up to the pixel right below the thing we hit that
            // isn't solid
            for (let i = this.up; i < height; i++) {
              // test this color
              let testColor = this.isPixelSolid(this.middleX, i);

              // if it's not solid we can stop here!
              if (testColor == false) {
                this.y = i;
                break;
              }
            }
          }
        } 
  }
    handleDoorMovement(){
        if(gamestate == 1){
        //check if a door was entered
        if(this.isDoor(this.middleX, this.up) && keyIsDown(38) && !this.locked && this.middleX > 52 && this.middleX < 94){
            console.log('entered selection door');
            //gamestate = 0;
        }
        if(mouseX > 52 && mouseX < 94 && mouseY > 376 && mouseY < 443){
            fill(0,150);
            rect(35,350,80,20);
            fill(255);
            text('main menu',45,365);
        }
        if(this.isDoor(this.middleX, this.up) && keyIsDown(38) && !this.locked && this.middleX > 401 && this.middleX < 442){
            console.log('entered lvl1 door');
            //gamestate = 2;
        }
        if(mouseX > 401 && mouseX < 442 && mouseY > 232 && mouseY < 297){
            fill(0,150);
            rect(390,200,60,20);
            fill(255);
            text('level 1',405,215);
        }
        if(this.isDoor(this.middleX, this.up) && keyIsDown(38) && !this.locked && this.middleX > 522 && this.middleX < 563){
            console.log('entered lvl2 door');
            //gamestate = 3;
        }
        if(mouseX > 522 && mouseX < 563 && mouseY > 334 && mouseY < 432){
            fill(0,150);
            rect(515,310,60,20);
            fill(255);
            text('level 2',527,325);
        }
        if(this.isDoor(this.middleX, this.up) && keyIsDown(38) && !this.locked && this.middleX > 670 && this.middleX < 712 && this.middleY > 300){
            console.log('entered minigame door');
            gamestate = 4;
        }
        if(mouseX > 670 && mouseX < 712 && mouseY > 456 && mouseY < 523){
            fill(0,150);
            rect(660,430,70,20);
            fill(255);
            text('minigame',670,443);
        }
        if(this.isDoor(this.middleX, this.up) && keyIsDown(38) && !this.locked && this.middleX > 692 && this.middleX < 744 && this.middleY < 300){
            console.log('entered boss door');
            //gamestate = 5;
        } 
        if(mouseX > 692 && mouseX < 744 && mouseY > 120 && mouseY < 203){
            fill(0,150);
            rect(690,90,50,20);
            fill(255);
            text('boss',701,105);
        }
        else if(this.isDoor(this.middleX, this.up) && keyIsDown(38) && this.locked){
            noStroke();
            fill(0,150);
            rect(this.middleX-50,this.up-14,100,20);
            fill(255);
            text('door is locked',this.middleX-35,this.up);
        }
        }
    }
    isPixelSolid(x,y){
        let temp = red(hitmap.get(x,y));
        if (temp == 0) {
          return true;
        }
          return false;
    }
    isDoor(x,y){
        let temp = red(hitmap.get(x,y));
        if (temp == 100) {
          return true;
        }  
          return false;  
    }
}

class mgCoin{
    constructor(){
        this.x;
        this.y;
        this.xpos = [50,100,150,200,250,300,350,400,450,500,550,600,650,700,750];
        this.ypos = [100,450];
        this.rx;
        this.ry;
        this.graphic = coin;
        this.noiseOffsetY = random(500,3000);
    }
    setPos(){
        this.rx = random(this.xpos);
        this.ry = random(this.ypos);
        if(this.rx != this.x){
            this.x = this.rx;
            this.y = this.ry;
            mgpoints +=1;
        } 
    }
    display(){
        coin.resize(30,30);
        this.collidedWithPlayer();
        image(this.graphic,this.x,this.y);
        this.y = constrain(this.y, 100, height-100);
        let yMovement = map(noise(this.noiseOffsetY), 0, 1, -4, 4);
        this.y += yMovement; 
        this.noiseOffsetY += 0.02;
    }
    collidedWithPlayer(){
        if (dist(this.x+15, this.y+15, p.x+15, p.y+15) < 30) { 
            this.setPos();
        }
}
}
