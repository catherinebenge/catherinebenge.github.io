let cmap;
let gamestate;
let p;

function preload() {

//load assets
  cmap=loadImage('images/protomap.jpg');
}

function setup() {
    createCanvas(800,600);
    
//set gamestate
    gamestate=-100;
    p = new Player(200,200);
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

//debug screen
function debug(){
    image(cmap,0,0);
    p.display();
    p.move();
    //p.keyTyped();
}

//levels screens 
function startScreen(){

}

function hubScreen(){
    
}

function levelOne(){
    
    
}

function levelTwo(){
    
    
}

function miniGame(){
    
    
}

function bossLevel(){
    
    
}

//player class prototype
class Player{
    constructor(initX,initY){
        this.x = initX;
        this.y = initY;
        this.y_acc = -12;
        this.dir;
        this.speed = 2;
        //this.yspeed = 2;
        this.color = 100;
        this.size = 30;
    }
    display(){
        this.findPlayerBounds();
        rectMode(CENTER);
        noStroke();
        fill(this.color);
        rect(this.x,this.y,30,30);
        fill(0);
        ellipse(this.left,this.y,10,10);
        ellipse(this.right,this.y,10,10);
        ellipse(this.x,this.up,10,10);
        ellipse(this.x,this.down,10,10);
        rectMode(CORNER);
    }
    findPlayerBounds(){
        this.left = this.x-15;
        this.right = this.x+15;
        this.up = this.y-15;
        this.down = this.y+15;
    }
    move(){
        this.color = color(0,255,0);
        this.findPlayerBounds();
        if(keyIsDown(65) || keyIsDown(37)){
            let p = red(cmap.get(this.left,this.y));
            if (p == 255) {
                console.log(this.x,this.y)
                this.x -= 2;
            }
            else{
                this.color = color(255,0,0);
            }
        }
        if(keyIsDown(68) || keyIsDown(39)){
            let p = red(cmap.get(this.right,this.y));
            if (p == 255) {
                this.x += this.speed;
            }
            else{
                this.color = color(255,0,0);
            }
        }
        if(keyIsDown(87) || keyIsDown(38)){
            let p = red(cmap.get(this.up,this.x));
            if (p == 255) {
                this.y -= this.speed;
            }
            else{
                this.color = color(255,0,0);
            }
        }
        if(keyIsDown(83) || keyIsDown(40)){
            let p = red(cmap.get(this.down,this.x));
            if (p == 255) {
                this.y += this.speed;
            }
            else{
                this.color = color(255,0,0);
            }
        }
    }
//    keyTyped() {
//        if(keyCode == 87) {
//            let jump_fl = true;
//            if (jump_fl) {
//                console.log('o');
//                this.y += this.y_acc;
//                this.y_acc += 1;
//            } if (this.y_acc >= 12) {
//                this.y_acc = 0;
//                jump_fl = false;
//            }
//            console.log(this.y_acc);
//        }
//    }
}
