const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");

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
  constructor(x, y, radius, color, stroke, speed) {
    super();
    Object.assign(this, { x, y, radius, color, stroke, speed });
  }
}

let player = new Player(250, 150, 25, "skyblue", "orange", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, { x, y, radius, color, speed });
  }
}

let enemies = [
  new Enemy(80, 200, 20, "rgba(250, 0, 50 ,0.8)", 0.02),
  new Enemy(200, 250, 17, "rgba(200, 100, 0, 0.7)", 0.01),
  new Enemy(0, 0, 22, "rgba(50, 10, 70, 0.5)", 0.002)
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

function updateScene() {
  follow(mouse, player, player.speed);
  enemies.forEach(enemy => follow(player, enemy, enemy.speed));
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
  if (progressBar.value <= 0) {
    console.log('Game over');
  } else {
    requestAnimationFrame(drawScene);
  }
}

requestAnimationFrame(drawScene);

