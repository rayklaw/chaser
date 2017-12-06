const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
let score = document.getElementById("score")


function startGame() {
  if (progressBar.value === 0) {
    progressBar.value = 100;
    score.innerHTML = 0;
    Object.assign(player, {x: canvas.width / 2, y: canvas.height / 2});
    requestAnimationFrame(drawScene);
  }
}

function increaseScore() {
  let gameScore = score.innerHTML;
  gameScore ++;
  score.innerHTML = gameScore;
  score = document.getElementById('score');
}

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < 
    sprite1.radius + sprite2.radius;
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

class Player extends Sprite {
  constructor(x, y, radius, speed) {
    super();
    this.image = new Image();
    this.image.src = "https://i.pinimg.com/originals/00/22/51/002251ab93aa8a09b5090fc4ad951f8c.png";
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x - 30, this.y - 30, 60, 60);
  }
}

let player = new Player(250, 150, 25, 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, speed) {
    super();
    this.image = new Image();
    this.image.src = "https://vignette.wikia.nocookie.net/mm54321/images/9/9d/Vector-goomba.png/revision/latest?cb=20141123221433";
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x - 30, this.y - 30, 60, 60);
  }
}

let enemies = [
  new Enemy(80, 200, 20, 0.02),
  new Enemy(200, 250, 17, 0.01),
  new Enemy(0, 0, 22, 0.002)
];

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const canvasRectangle = canvas.getBoundingClientRect();
  mouse.x = event.clientX - canvasRectangle.left;
  mouse.y = event.clientY - canvasRectangle.top;
}

function clearBackground() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function follow(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = c1.radius + c2.radius - L;
  if (distToMove > 0) {
    dx /= L; dy /= L;
    c1.x -= dx * distToMove / 2; c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2; c2.y += dy * distToMove / 2; 
  }
}

function updateScene() {
  follow(mouse, player, player.speed);
  enemies.forEach(enemy => follow(player, enemy, enemy.speed));
    enemies.forEach((enemy, i) => pushOff(enemy, enemies[(i+1) % enemies.length]));
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 0.5;
    }
  })
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  increaseScore();
  if (progressBar.value <= 0) {
    ctx.font = '30px Arial';
    ctx.fillText('The princess was in another castle, click to play again', 0, canvas.height/2);
  } else {
    requestAnimationFrame(drawScene);
  }
}

canvas.addEventListener('click', startGame);
requestAnimationFrame(drawScene);


