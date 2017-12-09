const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
let score = document.getElementById("score");

const PLAYER_RADIUS = 25;
const PLAYER_SPEED = 0.02;
const PLAYER_SPRITE_WIDTH = 60;
const PLAYER_SPRITE_HEIGHT = 60;
const ENEMY_RADIUS = 20;
const ENEMY_DAMAGE = 2;
const ENEMY_SPRITE_WIDTH = 60;
const ENEMY_SPRITE_HEIGHT = 60;
const ENEMY_SPEEDS = [0.01, 0.02, 0.03, 0.05];

const playerSpriteImage =
  "https://i.pinimg.com/originals/00/22/51/002251ab93aa8a09b5090fc4ad951f8c.png";
const enemySpriteImage =
  "https://vignette.wikia.nocookie.net/mm54321/images/9/9d/Vector-goomba.png/revision/latest?cb=20141123221433";

class Sprite {
  draw() {
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  }
  checkBoundary() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.radius > canvas.width) {
      this.x = canvas.width - this.radius / 2;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius / 2;
    }
  }
}

function pushOff(sprite1, sprite2) {
  let [dx, dy] = [sprite2.x - sprite1.x, sprite2.y - sprite1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = sprite1.radius + sprite2.radius - L;
  if (distToMove > 0) {
    dx /= L;
    dy /= L;
    sprite1.x -= dx * distToMove / 2;
    sprite1.y -= dy * distToMove / 2;
    sprite2.x += dx * distToMove / 2;
    sprite2.y += dy * distToMove / 2;
  }
}

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Player extends Sprite {
  constructor(x, y, radius, speed) {
    super();
    this.image = new Image();
    this.image.src = playerSpriteImage;
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.x - PLAYER_SPRITE_WIDTH / 2,
      this.y - PLAYER_SPRITE_HEIGHT / 2,
      PLAYER_SPRITE_WIDTH,
      PLAYER_SPRITE_HEIGHT
    );
  }
}

let player = new Player(
  canvas.width / 2,
  canvas.height / 2,
  PLAYER_RADIUS,
  PLAYER_SPEED
);

class Enemy extends Sprite {
  constructor(x, y, radius, speed) {
    super();
    this.image = new Image();
    this.image.src = enemySpriteImage;
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.x - ENEMY_SPRITE_WIDTH / 2,
      this.y - ENEMY_SPRITE_HEIGHT / 2,
      ENEMY_SPRITE_WIDTH,
      ENEMY_SPRITE_HEIGHT
    );
  }
}

let enemies = [
  new Enemy(0, 0, ENEMY_RADIUS, ENEMY_SPEEDS[0]),
  new Enemy(canvas.width, 0, ENEMY_RADIUS, ENEMY_SPEEDS[1]),
  new Enemy(0, canvas.height, ENEMY_RADIUS, ENEMY_SPEEDS[2]),
  new Enemy(canvas.width, canvas.height, ENEMY_RADIUS, ENEMY_SPEEDS[3])
];

function resetEnemies() {
  enemies = [];
  enemies.push(new Enemy(0, 0, ENEMY_RADIUS, ENEMY_SPEEDS[0]));
  enemies.push(new Enemy(canvas.width, 0, ENEMY_RADIUS, ENEMY_SPEEDS[1]));
  enemies.push(new Enemy(0, canvas.height, ENEMY_RADIUS, ENEMY_SPEEDS[2]));
  enemies.push(
    new Enemy(canvas.width, canvas.height, ENEMY_RADIUS, ENEMY_SPEEDS[3])
  );
}

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const canvasRectangle = canvas.getBoundingClientRect();
  mouse.x = event.clientX - canvasRectangle.left;
  mouse.y = event.clientY - canvasRectangle.top;
}

function follow(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function increaseScore() {
  let gameScore = score.innerHTML;
  gameScore++;
  score.innerHTML = gameScore;
  score = document.getElementById("score");
}

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateScene() {
  follow(mouse, player, player.speed);
  player.checkBoundary();
  increaseScore();
  enemies.forEach(enemy => follow(player, enemy, enemy.speed));
  enemies.forEach((enemy, i) =>
    pushOff(enemy, enemies[(i + 1) % enemies.length])
  );
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= ENEMY_DAMAGE;
    }
  });
  if (progressBar.value <= 0) {
    ctx.font = "23px Helvetica";
    ctx.textAlign = "center";
    ctx.fillStyle = "blue";
    ctx.fillText(
      "THE PRINCESS WAS IN ANOTHER CASTLE",
      canvas.width / 2,
      canvas.height / 2
    );
    ctx.fillText(
      "'CLICK' to play again",
      canvas.width / 2,
      canvas.height / 2 + 40
    );
  } else {
    requestAnimationFrame(drawScene);
  }
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
}

function restartGame() {
  if (progressBar.value === 0) {
    progressBar.value = 100;
    score.innerHTML = 0;
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    requestAnimationFrame(drawScene);
    resetEnemies();
  }
}

canvas.addEventListener("click", restartGame);
requestAnimationFrame(drawScene);
