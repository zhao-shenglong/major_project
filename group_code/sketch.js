let particles;
let img = [];
let n, s, maxR;
let indexImg = 0;
let capture;
let useWebcam = false;
let webcamButton;
let captureImg;
let countdown = 0;
let captureTime = 3;
let backButton;
let poseExample; // Add a pose example picture variable

function preload() {
  img.push(loadImage('assets/Edvard_Munch_The_Scream.jpeg'));
  poseExample = loadImage('assets/2.jpg'); // Preload sample pose pictures
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#FFEDDA");
  smooth();

  n = 1000;
  s = 10;
  maxR = min(width, height) / 2 - min(width, height) / 20;

  particles = [];

  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();

  if (webcamButton) webcamButton.remove();
  webcamButton = createButton('Use Webcam');
  webcamButton.position(20, 20);
  webcamButton.mousePressed(startWebcamCapture);

  if (backButton) backButton.remove();
  backButton = createButton('Back to Default Image');
  backButton.position(windowWidth - 200, 20);
  backButton.mousePressed(backToDefaultImage);

  initParticles();
}

function draw() {
  translate(width / 2, height / 2);
  noStroke();

  if (s > 1) {
    if (particles.length != 0) {
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.show();
        p.move();

        if (p.isDead()) particles.splice(i, 1);
      }
    } else {
      s -= 2;
      initParticles();
    }
  }

  if (countdown > 0) {
    clear();
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(`Switching in ${ceil(countdown)}`, 0, -height / 2 + 40);
    textSize(24);
    text("We will capture your image, please pose as you like", 0, -height / 2 + 80);
    
  // Draw example pose pictures
    let imgX = -poseExample.width / 2;
    let imgY = -height / 2 + 120;
    image(poseExample, imgX, imgY);

    countdown -= deltaTime / 1000;
    if (countdown <= 0) {
      captureImg = capture.get();
      useWebcam = true;
      setup();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxR = min(width, height) / 2 - min(width, height) / 20;
  particles = [];
  initParticles();
  webcamButton.position(20, 20);
  backButton.position(windowWidth - 200, 20);
}

function initParticles() {
  for (let i = 0; i < n; i++) {
    particles.push(new Particle(maxR, s));

    let p = particles[i];
    let x, y, c;
    if (useWebcam && captureImg) {
      x = int(map(p.pos.x, -maxR, maxR, 0, captureImg.width));
      y = int(map(p.pos.y, -maxR, maxR, 0, captureImg.height));
      c = captureImg.get(x, y);
    } else {
      x = int(map(p.pos.x, -maxR, maxR, 0, img[indexImg].width));
      y = int(map(p.pos.y, -maxR, maxR, 0, img[indexImg].height));
      c = img[indexImg].get(x, y);
    }
    p.c = c;
  }
}

function mousePressed() {
  if (!useWebcam) {
    indexImg = (indexImg + 1) % img.length;
    setup();
  }
}

function startWebcamCapture() {
  countdown = captureTime;
  useWebcam = false;
}

function backToDefaultImage() {
  useWebcam = false;
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

  init() {
    this.pos = p5.Vector.random2D();
    this.pos.normalize();
    this.pos.mult(random(2, this.maxR));
    this.vel = createVector();
  }

  show() {
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.s, this.s);
    this.life -= 1;
  }

  move() {
    let angle = noise(this.pos.x / 400, this.pos.y / 600) * TAU;
    this.vel.set(cos(angle), sin(angle));
    this.vel.mult(0.3);
    this.pos.add(this.vel);
  }

  isDead() {
    let d = dist(this.pos.x, this.pos.y, 0, 0);
    return d > this.maxR || this.life < 1;
  }
}
