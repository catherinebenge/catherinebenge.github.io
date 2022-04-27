let hitmap;
let player;

function preload() {
  // hitmap for collision detection
  hitmap = loadImage('hitmap.png');
}

function setup() {
  createCanvas(500,500);
  player = new Player(50,100);
}

function draw() {
  image(hitmap, 0, 0);
  player.move();
  player.display();
}

class Player {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.ySpeed = 0;
    this.gravity = 0.3;
    this.computeSensors();
  }

  display() {
    fill(0,255,0);
    rect(this.x, this.y, this.size, this.size);

    // draw sensors
    fill(0,0,255);
    ellipse(this.left, this.middleY, 5, 5);
    ellipse(this.right, this.middleY, 5, 5);
    ellipse(this.middleX, this.up, 5, 5);
    ellipse(this.middleX, this.down, 5, 5);
  }

  // compute our sensors
  computeSensors() {
    this.left = this.x - 3;
    this.right = this.x + this.size + 3;
    this.up = this.y - 3;
    this.down = this.y + this.size + 3;
    this.middleX = this.x + this.size/2;
    this.middleY = this.y + this.size/2;
  }

  move() {
    // compute our current sensor position
    this.computeSensors();

    // handle fall / jump movement
    this.handleFallJumpMovement();

    // deal with keyboard movement
    if (keyIsDown(LEFT_ARROW)) {
      // only all movement if the next pixel is not solid
      if (!this.isPixelSolid(this.left, this.middleY)) {
        this.x -= 2;
      }
    }
    if (keyIsDown(RIGHT_ARROW)) {
      // only all movement if the next pixel is not solid
      if (!this.isPixelSolid(this.right, this.middleY)) {
        this.x += 2;
      }
    }

    // only allow jumping if we are on the ground ('A' key)
    if (keyIsDown(65) && this.isPixelSolid(this.middleX, this.down)) {
      this.ySpeed = -8;
    }
  }

  // fall / jump logic
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

  isPixelSolid(x,y) {
    let temp = red(hitmap.get(x,y));
    if (temp == 0) {
      return true;
    }
    return false;
  }

}
