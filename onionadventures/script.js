//THE ADVENTURES OF ONION
//Midterm Project 

//image variables
let hub_hm,mg_hm,hub_bg,mg_bg,coin,lock;

//gamestate controls switch statement
let gamestate;
let p;

//timer and minigame mechanics
let time;
let begin;
let playing = false;
let firstgame = true;
let coins = [];
let mgpoints;
let noiseLocation = 0;

//level one
let bg_x = 0;
let bushes;
let bushes_x = 0;
let trees;
let trees_x = 0;
let front_leaves;
let front_leaves_x = 0;
let scrolling = false;
let test_hitmap;
let level1_hitmap;

//level 2
let level2_hitmap;
let level2bg;
let foreground;
let fg_x = 0;
let sand;
let sand_x = 0;

//globals 
let level1_completed = false;
let level2_completed = true;
let enemy_image;
let points;
let temp;
let at01;

//sprite images and animation arrays
let playersprites, redimg, onionimg, fairyimg;
let spritedata;
let character;
let enemydata;
let enemies = [];

let chara = 0;
let action = "idleR";
let aniR = [];
let aniO = [];
let aniF = [];
let aniAtk = [];

//sounds
let jumpsfx;
let death_sound;
let complete_sound;
let startbgm, hubbgm, level1bgm, level2bgm;



function preload() {
    death_sound = loadSound('images/death.mp3');
    complete_sound = loadSound('images/complete.mp3');
    
    //bgs and hitmaps
    hub_hm = loadImage('images/hitmaps/hubhitmapwdoors.png');
    mg_hm = loadImage('images/hitmaps/mghitmap.png');
    hub_bg = loadImage('images/bgs/bghubwdoors.png');
    mg_bg = loadImage('images/bgs/bgmg.png');
    
    //misc assets
    coin = loadImage('images/misc/coin.png');
    lock = loadImage('images/misc/lock.png');
    
    //sprites
    spritedata = loadJSON('spriteframes.json');
    playersprites = loadImage('images/spritesheets/playerspritesfinal.png');
    redimg = loadImage('images/spritesheets/red.png');
    onionimg = loadImage('images/spritesheets/onion.png');
    fairyimg = loadImage('images/spritesheets/fairy.png');
    enemydata = loadJSON('enemyloc.json');
    at01 = loadFont('at01.ttf');

    //sound
    jumpsfx = loadSound('sounds/jump.mp3');

    //level one
    test_hitmap=loadImage('images/hitmaps/level_hitmap_t.png');
    level1_hitmap = loadImage('images/level1hitmap.png');
    level1bg = loadImage('images/parallax_forest2/j1.png');
    bushes = loadImage('images/parallax_forest1/bushes.png');
    trees = loadImage('images/parallax_forest1/trees.png');
    front_leaves = loadImage('images/parallax_forest1/frontleaves.png');
    enemy_image = loadImage('images/enemy.gif');
    
    //level two
    level2_hitmap = loadImage('images/level2hitmap.png');
    far = loadImage('images/bgs/far.png');
    level2bg = loadImage('images/bgs/level2bg.png');
    foreground = loadImage('images/parallax_water/foregound-merged.png');
    sand = loadImage('images/parallax_water/sand.png');
}

function setup() {
    //canvas and image resizing
    let canvas = createCanvas(800, 600);
    canvas.position(0, 0);
    level1_hitmap.resize(4268, 600);
    level1bg.resize(4268, 600);
    
    //fonts
    textFont(at01);
    textSize(20);

    // enemies
    enemy1 = new Enemy(720, 525);
    enemy2 = new Enemy(1640, 370);
    enemy3 = new Enemy(2370, 415);
    enemy4 = new Enemy(3710, 80);
    enemy5 = new Enemy(725, 325);
    enemy6 = new Enemy(1000, 470);
    enemy7 = new Enemy(1275, 470);
    enemy8 = new Enemy(1480, 360);
    enemy9 = new Enemy(1920, 310);
    enemy10 = new Enemy(2610, 160);
    enemy11 = new Enemy(2997, 473);
    enemy12 = new Enemy(3444, 253);
    enemy13 = new Enemy(3874, 353);
    
    //game state
    gamestate=0;
    points = 0;
    
    //user sprite
    p = new Player(60,402);
    
    //set timer to one second
    setInterval(timer, 1000);
    
    //load in coins for minigame
    for( let i = 0; i < 6; i++){
            temp = new mgCoin();
            coins.push(temp);
            coins[i].setPos();
    }
    //noise for coins
    noiseDetail(24);

    //different player characters array setup
    let redFrames= spritedata.redFrames;
    for (let i = 0; i < redFrames.length; i++){
      let pos = redFrames[i].position;
      let img = playersprites.get(pos.x,pos.y,pos.w,pos.h);
      aniR.push(img);
    }

    let onionFrames= spritedata.onionFrames;
    for (let i = 0; i < onionFrames.length; i++){
      let pos = onionFrames[i].position;
      let img = playersprites.get(pos.x,pos.y,pos.w,pos.h);
      aniO.push(img);
    }

    let fairyFrames = spritedata.fairyFrames;
    for (let i = 0; i < fairyFrames.length; i++){
        let pos = fairyFrames[i].position;
        let img = playersprites.get(pos.x,pos.y,pos.w,pos.h);
        aniF.push(img);
    }

    let fireFrames = spritedata.fireFrames;
    for (let i = 0; i < fireFrames.length; i++){
        let pos = fireFrames[i].position;
        let img = playersprites.get(pos.x,pos.y,pos.w,pos.h);
        aniAtk.push(img);
    }
    

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


//debug screen
function debug(){
    hitmap = test_hitmap;
    image(hitmap,0,0);
    p.display();
    p.move();
}

//levels screens 
function startScreen(){
    //add side-scrolling parallax bg later for the characters to "walk" on
    background(135,206,250);
    fill(255,160,122);
    rect(0,500,800,100);
    fill(0);
    
    textAlign(CENTER);
    textSize(100);
    text('THE ADVENTURES\nOF ONION',width/2,150);
    textSize(30);
    text('Use the arrow keys to choose a character\nPress ENTER when ready!',width/2,540);

    //character selection
    chara_select();
    if(chara == 0){
        image(redimg,350,450);
    }
    else if(chara == 1){
        image(fairyimg,350,450);
    }
    else if(chara == 2){
        image(onionimg,350,450);
    }

    textAlign(LEFT);
}

function hubScreen(){
    //hitmap and player mechanics for hub screen
    textSize(20);
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
    // moving hitmap for first lvl
    hitmap = level1_hitmap;
    image(hitmap, bg_x, 0);
    background(100);
    // trees
    for (let i=0; i < 4; i++) {
        let tree_random = [50, 100, 0, -50];
        image(trees, trees_x + (i * 512 - tree_random[i]), 200);
    }
    // leaves
    for (let i=0; i < 4; i++) {
        noStroke();
        fill(9, 10, 19);
        rect(0, 0, 800, 200);
        image(front_leaves, front_leaves_x + (i * 500) - 20, 200);
    }
    // bushes
    for (let i=0; i < 7; i++) {
        image(bushes, bushes_x + (i * 512), 200);
    }
    image(level1bg, bg_x, 0);
    p.display();
    p.moveinlevel();
    //playing = true;
    enemy1.display();
    enemy2.display();
    enemy3.display();
    enemy4.display();
}

function levelTwo(){
    //same mechanics - level 2
    hitmap = level2_hitmap;
    image(hitmap, bg_x, 0);
    image(far,bg_x,0);
    //looping over parallax images to tile them
    for (let i=0; i < 13; i++) {
        image(sand, sand_x + (i * 256), 210);
    }
    for (let i=0; i < 7; i++) {
        image(foreground, fg_x + (i * 512), 220);
    }
    image(level2bg,bg_x,0);
    p.display();
    p.moveinlevel();
    //playing = true;
    enemy5.display();
    enemy6.display();
    enemy7.display();
    enemy8.display();
    enemy9.display();
    enemy10.display();
    enemy11.display();
    enemy12.display();
    enemy13.display();
}

function miniGame(){
    // timer that controls game inspired by sample code: https://editor.p5js.org/denaplesk2/sketches/ryIBFP_lG
    //click to begin
    hitmap = mg_hm;
    image(hitmap,0,0);
    fill(0);
    rect(0,0,width,height);
    
    //if clicked, begin game
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
        
        //display the coins
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
//timer functions 
function timer() {
  if (time > 0) {
    time--;
  }
}
//reset timer
function setTimer(){
   time = 30; 
}

//reset levels - return characters to positions and reset background offset variable
function restart_level1() {
    bg_x = 0;
    bushes_x = 0;
    front_leaves_x = 0;
    trees_x = 0;
    scrolling = false;
    p.x = 60;
    p.y = 402;
}

function level1_complete() {
    bg_x = 0;
    bushes_x = 0;
    front_leaves_x = 0;
    trees_x = 0;
    level1_completed = true;
    gamestate = 1;
    p.x = 90;
    p.y = 350;
}

function restart_level2() {
    bg_x = 0;
    sand_x = 0;
    fg_x = 0;
    scrolling = false;
    p.x = 60;
    p.y = 402;
}

function level2_complete() {
    bg_x = 0;
    sand_x = 0;
    fg_x = 0;
    level2_completed = true;
    gamestate = 1;
    p.x = 90;
    p.y = 350;
}

//character selection function
function chara_select(){
        if(keyIsDown(37)) {
            chara -= 1;
        }
        if(keyIsDown(39)){
            chara += 1;
        }

        if(chara < 0){
            chara = 0;
        }
        if(chara > 2){
            chara = 2;
        }
        
        if(keyIsDown(13)){
            character = new Sprite(chara,1);
            gamestate = 1;
        }
}

//player class 
class Player{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 20;
        this.ySpeed = 0;
        this.gravity = 0.3;
        this.findPlayerBounds();
        this.findPlayerBounds_level();
        this.locked = false;
        this.fake_x = x;
    }
    //show the player sprite
    display(){
        fill(0,255,0);
        imageMode(CENTER);
        //prototype character - for debugging
        // rect(this.x, this.y, this.size, this.size);
        character.display(this.x,this.y);
        character.animate();
        imageMode(CORNER);
        // draw sensors - for debugging
         //fill(0,0,255);
         //ellipse(this.left, this.middleY, 5, 5);
         //ellipse(this.right, this.middleY, 5, 5);
         //fill(255,0,0);
         //ellipse(this.middleX, this.up, 5, 5);
         //ellipse(this.middleX, this.down, 5, 5);
    }
    //compute sensors of sprite
    findPlayerBounds(){
        this.left = this.x - 25;
        this.right = this.x + this.size + 3;
        this.up = this.y - 20;
        this.down = this.y + this.size + 3;
        this.middleX = this.x;
        this.middleY = this.y;
    }
    //compute sensors in level
    findPlayerBounds_level(){
        this.fake_x = this.x + (bg_x * -1);
        this.left = this.fake_x - 30;
        this.right = this.fake_x + this.size + 3;
        this.up = this.y - 25;
        this.down = this.y + this.size + 3;
        this.middleX = (this.fake_x + this.size/2) - 25;
        this.middleY = this.y + this.size/2;
    }
    //did the user die?
    death_detection(x, y) {
        let temp = blue(hitmap.get(x,y));
            if (temp == 0) {
            //console.log(temp);
            return true;
            }
            return false;
    }
    //move the character
    move(){
        //compute our current sensor position
        this.findPlayerBounds();

        // handle fall / jump movement
        this.handleFallJumpMovement();
        this.handleDoorMovement();
        
        if(keyIsDown(65) || keyIsDown(37)){
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x -= 3;
                action = "walkL";
              }
        }
        if(keyIsDown(68) || keyIsDown(39)){
           // only all movement if the next pixel is not solid
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x += 3;
                action = "walkR";
            }
        }
        //jump the character
        if (keyIsDown(32) && this.isPixelSolid(this.middleX, this.down)) {
          this.ySpeed = -10;
          action = "jump";
          jumpsfx.play();
        }
    }
    moveinlevel() {
        //run functions for movement
        this.findPlayerBounds_level();
        this.handleFallJumpMovement();
        this.handleDoorMovement();

        // DEATH AND COMPLETION
        if(gamestate == 2){
           if (this.down > 600) {
            restart_level1();
            death_sound.play();
        }
        if (this.fake_x > 4200) {
            level1_complete();
            complete_sound.play();
        } 
        }
        if(gamestate == 3){
           if (this.down > 600) {
            restart_level2();
            death_sound.play();
        }
        if (this.fake_x > 4200) {
            level2_complete();
            complete_sound.play();
        } 
        }
        // EXIT AT ANY TIME
        if (keyIsDown(27)) {
            gamestate = 1;
            bg_x = 0;
            bushes_x = 0;
            front_leaves_x = 0;
            trees_x = 0;
            scrolling = false;
            p.x = 60;
            p.y = 402;
        }
        
        // movement right before reaching half the screen
        if ((gamestate == 2 || gamestate == 3) && bg_x <= 0 && (keyIsDown(68) || keyIsDown(39)) && scrolling == false) {
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x += 3;
                action = "walkR";
            }
        }
        // background movement to make the player look like theyre going left
        if ((gamestate == 2 || gamestate == 3) && this.x <= 400 && bg_x < 0 && (keyIsDown(65) || keyIsDown(37))) {
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x = 400;
                scrolling = true;
                bg_x += 3;
                bushes_x += 2;
                front_leaves_x += 1;
                trees_x += 1;
                sand_x += 2; 
                fg_x +=1;
                action = "walkL";
            }
        } // movement left after finishing the background scroll
        if ((gamestate == 2 || gamestate == 3) && bg_x >= -3468 && (keyIsDown(65) || keyIsDown(37)) && scrolling == false) {
            if (!this.isPixelSolid(this.left, this.middleY)) {
                this.x -= 3;
                action = "walkL";
            }
        } // background movement to make the player look like theyre going right
        if ((gamestate == 2 || gamestate == 3) && this.x >= 400 && bg_x > -3467 && (keyIsDown(68) || keyIsDown(39))) {
            if (!this.isPixelSolid(this.right, this.middleY)) {
                this.x = 400;
                scrolling = true;
                bg_x -= 3;
                bushes_x -= 2;
                trees_x -= 1;
                front_leaves_x -= 1;
                sand_x -= 2; 
                fg_x -=1;
                action = "walkR";
            }
        } // stop background scroll in the beginning and make the player move left
        if ((gamestate == 2 || gamestate == 3) && bg_x >= 0 && (keyIsDown(65) || keyIsDown(37)) && scrolling == true) {
            if (!this.isPixelSolid(this.left, this.middleY)) {
                bg_x = 0;
                this.x -= 3;
                bushes_x = 0;
                front_leaves_x = 0;
                trees_x = 0;
                scrolling = false;
                sand_x += 0; 
                fg_x += 0;
                action = "walkL";
            }
        } // stop background scroll at the end and make the player move right
        if ((gamestate == 2 || gamestate == 3) && bg_x <= -3468 && (keyIsDown(68) || keyIsDown(39)) && scrolling == true) {
            if (!this.isPixelSolid(this.right, this.middleY)) {
                bg_x = -3468;
                bushes_x = -2312;
                trees_x = -1156;
                front_leaves_x = -1156;
                this.x += 3;
                scrolling = false;
                sand_x = -1156;
                fg_x = -2312;
                action = "walkR";
            }
        }
        //jumping mechanics
        if (keyIsDown(32) && this.isPixelSolid(this.middleX, this.down)){
            this.ySpeed = -10;
        }
        if (keyIsDown(32) && this.isPixelSolid(this.middleX, this.down)) {
          this.ySpeed = -10;
          action = "jump";
          jumpsfx.play();
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
        //door mechanics for hub
        if(gamestate == 1){
        //check if a door was entered
        if(this.isDoor(this.middleX, this.up) && (keyIsDown(38) || keyIsDown(87)) && this.middleX < 140 && this.middleX > 60){
            console.log('entered selection door');
            gamestate = 0;
        }
        //is this door being mouse over?
        if(mouseX > 60 && mouseX < 114 && mouseY > 359 && mouseY < 443){
            fill(0,150);
            rect(48,330,80,20);
            fill(255);
            text('main menu',58,345);
        }
        //level one door
        if(this.isDoor(this.middleX, this.up) && (keyIsDown(38) || keyIsDown(87)) && this.middleX < 455 && this.middleX > 370){
            console.log('entered lvl1 door');
            gamestate = 2;
            p.x = 75;
            p.y = 400;
        }
        if(mouseX > 401 && mouseX < 455 && mouseY > 208 && mouseY < 295){
            fill(0,150);
            rect(400,180,60,20);
            fill(255);
            text('level 1',415,195);
        }
        //level 2 door
        if(this.isDoor(this.middleX, this.up) && (keyIsDown(38) || keyIsDown(87)) && level1_completed && this.middleX > 717 && this.middleX < 784 && this.middleY < 300){
            console.log('entered lvl2 door');
            gamestate = 3;
            p.x = 75;
            p.y = 400;
        }
        if(mouseX > 697 && mouseX < 755 && mouseY > 108 && mouseY < 199){
            fill(0,150);
            rect(698,80,60,20);
            fill(255);
            text('level 2',710,95);
        }
        //minigame door
        if(this.isDoor(this.middleX, this.up) && (keyIsDown(38) || keyIsDown(87)) && this.middleX > 670 && this.middleX < 785 && this.middleY > 300){
            console.log('entered minigame door');
            gamestate = 4;
        }
        if(mouseX > 670 && mouseX < 724 && mouseY > 439 && mouseY < 521){
            fill(0,150);
            rect(660,410,70,20);
            fill(255);
            text('minigame',670,423);
        }
        // if level two door is locked
        else if(this.isDoor(this.middleX, this.up) && (keyIsDown(38) || keyIsDown(87)) && !level1_completed && this.middleX > 717 && this.middleX < 784 && this.middleY < 300){
            noStroke();
            fill(0,150);
            rect(this.middleX-50,this.up-14,100,20);
            fill(255);
            text('door is locked',this.middleX-35,this.up);
        }
        }
    }
    // is the hitmap black? stop movement
    isPixelSolid(x,y){
            let temp = red(hitmap.get(x,y));
            if (temp == 0) {
            return true;
            }
            return false;
    }
    //if 100 - purple - then its a door
    isDoor(x,y){
        let temp = red(hitmap.get(x,y));
        if (temp == 100) {
          return true;
        }  
          return false;  
    }
}

//coin class for minigame
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
    //setting a new position each time player "grabs" a coin
    setPos(){
        this.rx = random(this.xpos);
        this.ry = random(this.ypos);
        if(this.rx != this.x){
            this.x = this.rx;
            this.y = this.ry;
            mgpoints +=1;
        } 
    }
    //display coin - if theres a collision
    display(){
        coin.resize(30,30);
        this.collidedWithPlayer();
        image(this.graphic,this.x,this.y);
        
        //move with perlin noise
        this.y = constrain(this.y, 100, height-100);
        let yMovement = map(noise(this.noiseOffsetY), 0, 1, -4, 4);
        this.y += yMovement; 
        this.noiseOffsetY += 0.02;
    }
    //if the player collides with the coin
    collidedWithPlayer(){
        if (dist(this.x+15, this.y+15, p.x+15, p.y+15) < 30) { 
            this.setPos();
        }
}
}

//based on Coding Train's code: https://editor.p5js.org/codingtrain/sketches/vhnFx1mml
class Sprite {
    constructor(ani,speed){
        this.ani = ani;
        this.speed = speed;
        this.index = 0;
        //animation states
        if (this.ani == 0){
            this.animation = aniR;
        }
        else if (this.ani == 2){
            this.animation = aniO;
        }
        else if (this.ani == 1){
            this.animation = aniF;
        }
        this.len = this.animation.length;
    }
//show sprite
    display(x,y){
        this.x = x;
        this.y = y;
        //0 is red, 1 is onion, 2 is fairy
        //frameRate(4);
        let index = floor(this.index) % this.len;
        image(this.animation[index],this.x,this.y);
    }
//animate sprite every 10 frames
    animate(){
        if(frameCount%10==0){
            this.index = this.index + this.speed;
            //console.log(action);
        //
        if(gamestate == 0){
            if(gamestate == 0){
                if(this.animation == aniR){
                    if(this.index > 6 || this.index < 3){
                        this.index = 3;
                    } 
                }
                else if(this.animation == aniO){
                    if(this.index < 3 || this.index > 4){
                        this.index = 3;
                    }
                }
                else if(this.animation == aniF){
                    if(this.index < 10 || this.index > 13){
                        this.index = 10;
                    }
                }
            }

            
            //control actions for sprite - images
            if(action=="idleL"){
                if(this.animation == aniR){
                    if(this.index != 13){
                        this.index = 13;
                        }
                }
                
            }

            if(action == "idleR"){
                if(this.animation == aniR){
                    if(this.index != 0){
                        this.index = 0;
                    }
                }
            }

            if (action == "walkL"){
                
                if(this.animation == aniR){
                    if(this.index < 7 || this.index > 10){
                        this.index = 7;
                        }
                    }

                action = "idleL";
            }

            if (action == "walkR"){
                if(this.animation == aniR){
                    if(this.index < 3 || this.index > 6){
                        this.index = 3;
                    }
                }

                action = "idleR";
            }
            
        }   
    }
}
}

//enemy class
class Enemy{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.actual_x;
   }
    update_pos() {
        //adjust to offset of parallax
        this.actual_x = this.x - (bg_x * -1);
    }
    display(){
        //display enemy and run class mechanics
        this.update_pos();
        this.enemy_detection();
        if (gamestate == 2 || gamestate == 3) {
           fill(255, 0, 0);
           imageMode(CENTER);
           image(enemy_image, this.actual_x,this.y, 75, 75);
           imageMode(CORNER);
       }
    }
    //did the enemy and the player collide? 
    enemy_detection() {
        if (dist(p.fake_x, p.middleY, this.x, this.y) < 45) {
            restart_level1();
            death_sound.play();
        }
    }
}