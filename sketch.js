let player;
let bullets = [];
let enemies = [];
let enemyRows = 3;
let enemyCols = 5;
let enemySpacing = 50;
let enemySize = 30;
let playerSpeed = 5;
let bulletSpeed = 7;
let enemySpeed = 2;
let currentWave = 1;
let points = 0; // Initialize points counter and all other variables

function setup() {
  createCanvas(600, 400);
  player = new Player();
  spawnEnemies();
}

function draw() {
  // Draw waves on the blue background
  background(65, 105, 225); 
  
  fill(100, 150, 255); // Adjusted shade of blue for waves
  noStroke();
  
  for (let y = 0; y < height; y += 20) {
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let wave = sin(x * 0.02 + frameCount * 0.05 + y * 0.1) * 10;
      vertex(x, y + wave);
    }
    endShape();
  }
  
  // Draw yellow sand
  fill(255, 215, 0);
  rect(0, height * 0.9, width * 2, height * 0.1);
  
  // Display current wave
  textSize(16);
  fill(255);
  textAlign(LEFT);
  text("Wave: " + currentWave, 10, 20);

  // Display points
  text("Points: " + points, 10, 40);

  
  for (let enemy of enemies) {
    enemy.display();
    enemy.update();
    
    if (enemy.hits(player)) {
      gameOver();
    }
  }
  
  player.display();
  player.update();
  
  for (let bullet of bullets) {
    bullet.display();
    bullet.update();
  }
  
  // Check collision between bullets and enemies
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(enemies[j])) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        points += 5; 
        break;
      }
    }
  }
  
  if (enemies.length === 0) {
    currentWave++;
    points += 20; 
    spawnEnemies();
  }
}


function spawnEnemies() {
  enemies = [];
  for (let i = 0; i < enemyRows; i++) {
    for (let j = 0; j < enemyCols + currentWave - 1; j++) {
      enemies.push(new Enemy(j * enemySpacing + 50, i * enemySpacing + 50));
    }
  }
}
//movement stuff
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player.move(1);
  } else if (keyCode === LEFT_ARROW) {
    player.move(-1);
  } else if (key === ' ') {
    bullets.push(new Bullet(player.x, height - 30));
    player.shoot(); // Call shoot() when spacebar is pressed for mouth
  }
}


function keyReleased() {
  if ((keyCode === RIGHT_ARROW && player.speed > 0) || (keyCode === LEFT_ARROW && player.speed < 0)) {
    player.move(0);
  }
}
//endagame function
function gameOver() {
  textSize(32);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2);
  noLoop();
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.speed = 0;
    this.size = 40;
    this.color = color(255, 0, 0); 
    this.eyeDetailSize = 14; 
    this.innerEyeDetailSize = 6;
    this.offset = 3; 
    this.mouthHeight = 5; 
    this.mouthWidth = 15; 
    this.mouthOpen = false; // indicate if the mouth is open
  }
  
  display() {
    // Main player
    fill(this.color);
    ellipse(this.x, this.y, 40, 40); // body
    
    // Eyes
    fill(255); // White color for eyes
    ellipse(this.x - 15, this.y, 20, 20); // Left eye
    ellipse(this.x + 15, this.y, 20, 20); // Right eye
    
    // Tiny black circles for eye detail
    fill(0); 
    ellipse(this.x - 15, this.y, this.eyeDetailSize, this.eyeDetailSize); // Left eye detail
    ellipse(this.x + 15, this.y, this.eyeDetailSize, this.eyeDetailSize); // Right eye detail
    
    // Tiny white circles within the black circles
    fill(255); 
    ellipse(this.x - 15 + this.offset, this.y - this.offset, this.innerEyeDetailSize, this.innerEyeDetailSize); // Left eye inner detail
    ellipse(this.x + 15 - this.offset, this.y - this.offset, this.innerEyeDetailSize, this.innerEyeDetailSize); // Right eye inner detail
    
    // Draw mouth
    if (this.mouthOpen) {
      // Mouth is open
      fill(0); 
      rect(this.x - this.mouthWidth / 2, this.y + 10, this.mouthWidth, this.mouthHeight, 5);
    }
  }
  
  update() {
    this.x += this.speed;
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
  }
  
  move(dir) {
    this.speed = dir * playerSpeed;
  }
  
  shoot() {
    // Open the mouth when shooting
    this.mouthOpen = true;
    // Close the mouth after a short delay
    setTimeout(() => {
      this.mouthOpen = false;
    }, 100);
  }
}



class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = bulletSpeed;
    this.size = 5;
  }
  
  display() {
    fill(255);
    ellipse(this.x, this.y, this.size);
  }
  
  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      bullets.splice(bullets.indexOf(this), 1);
    }
  }
  
  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.size / 2 + enemy.size / 2;
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = enemySpeed;
    this.size = enemySize;
    this.direction = 1; 
    this.color = color(255, 0, 0);
    this.eyeColor = color(255);
    this.eyeSize = 5;
  }
  
  display() {
    
    fill(this.color);
    ellipse(this.x, this.y, 32, 32); // Main body
    
    // Eyes
    fill(this.eyeColor);
    ellipse(this.x - 8, this.y - 5, this.eyeSize, this.eyeSize); 
    ellipse(this.x + 8, this.y - 5, this.eyeSize, this.eyeSize);
    
    // Details
    fill(0);
    ellipse(this.x - 5, this.y + 5, 5, 5);
    ellipse(this.x + 5, this.y + 5, 5, 5);
    rect(this.x - 7, this.y + 10, 14, 5);
    rect(this.x - 10, this.y + 15, 20, 5);
    ellipse(this.x, this.y + 20, 15, 10);
  }
  
  update() {
    this.x += this.speedX * this.direction;
    
    if (this.x + this.size / 2 >= width || this.x - this.size / 2 <= 0) {
      this.direction *= -1;
      this.y += 20; 
    }
  }
  
  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.size / 2 + player.size / 2;
  }
}
