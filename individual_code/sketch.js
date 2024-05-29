var particles;
var img = [];
var n, s, maxR; // The number, size, and maximum radius of the particles.
var indexImg = 0;

function preload() {
  img.push(loadImage('assets/Edvard_Munch_The_Scream.jpeg')); // The image 'The Scream' from Canvas.
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#FFEDDA");
  smooth();

  // Give a certain number, size, and maximum radius of the particles.
  n = 1000;
  s = 10;
  maxR = height / 2 - height / 20;

  particles = [];
}

function draw() {
  translate(width / 2, height / 2); 
  noStroke();

  // Control the size of the particles based on the x-position of the mouse.
  s = map(mouseX, 0, width, 1, 20);
  // Control the colour of the particles based on the y-position of the mouse.
  let colour = map(mouseY, 0, height, 0, 1);

  /*
  When the size is bigger than 1:
  - If the array is not empty, draw and move each particle and check if it is dead.
  - If the array is empty, reduce the size and initialise the particles.
  */
  if (s > 1) {
    if (particles.length != 0) {
      for (let i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.show(colour);
        p.move();

        if (p.isDead()) particles.splice(i, 1);
      }
    } else {
      s -= 2;
      initParticles();
    }
  }
}

// Make the colour of each particle the same as the image based on its position.
function initParticles() {
  for (let i = 0; i < n; i++) {
    particles.push(new Particle(maxR, s));

    var p = particles[i];
    var x = int(map(p.pos.x, -maxR, maxR, 0, img[indexImg].width));
    var y = int(map(p.pos.y, -maxR, maxR, 0, img[indexImg].height));
    p.c = img[indexImg].get(x, y);
  }
}

// This is an event: clicking mouse to clear the canvas.
function mousePressed() {
  indexImg = (indexImg + 1) % img.length;
  setup();
}

class Particle {
  constructor(maxR_, s_) {
    this.s = s_;
    this.c = "";
    this.maxR = maxR_;

    this.life = 200;

    this.init();
  }

  // Initialise the position and speed of the particles.
  init() {
    this.pos = p5.Vector.random2D();
    this.pos.normalize();
    this.pos.mult(random(2, this.maxR));

    this.vel = createVector();
  }

  // Draw the particles with colours
  show(colour) {
    let r = red(this.c) * colour;
    let g = green(this.c) * colour;
    let b = blue(this.c) * colour;
    fill(r, g, b);
    ellipse(this.pos.x, this.pos.y, this.s, this.s);
    this.life -= 1;
  }

  // Make the particles move and the Perlin Noise is used to control the angles generated.
  move() {
    var angle = noise(this.pos.x / 400, this.pos.y / 600) * TAU;

    this.vel.set(cos(angle), sin(angle));
    this.vel.mult(0.3);
    this.pos.add(this.vel);
  }

  // Check if the particles are dead.
  isDead() {
    var d = dist(this.pos.x, this.pos.y, 0, 0);
    return d > this.maxR || this.life < 1;
  }
}