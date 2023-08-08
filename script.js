const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let x = canvas.width / 2;
let y = canvas.height - 80;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - (paddleHeight + 60)
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 3;
const brickWidth = 75;
const brickColumnCount = Math.ceil(canvas.width / brickWidth) * 0.8;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickOffsetRight = 30;
let speed= 1;
let score = 0;
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

function keyDownHandler(e) {
	if (e.key === 'Right' || e.key === 'ArrowRight') {
		rightPressed = true;
	} else if (e.key === 'Left' || e.key === 'ArrowLeft') {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.key === 'Right' || e.key === 'ArrowRight') {
		rightPressed = false;
	} else if (e.key === 'Left' || e.key === 'ArrowLeft') {
		leftPressed = false;
	}
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}

		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	drawScore();
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}

	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > (canvas.height - ballRadius - 60)) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		}
		if(y > (paddleY + 40) && y < (paddleY + paddleHeight + 40)) {
			alert('GAME OVER');
			document.location.reload();
			clearInterval(interval); // Needed for Chrome to end game
		}
	}

	if (rightPressed) {
		paddleX += 7;
		if (paddleX + paddleWidth > canvas.width) {
			paddleX = canvas.width - paddleWidth;
		}
	} else if (leftPressed) {
		paddleX -= 7;
		if (paddleX < 0) {
			paddleX = 0;
		}
	}

	x += (dx * speed);
	y += (dy * speed);
}

function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			const b = bricks[c][r];
			if (b.status === 1) {
				if (
					x > b.x &&
					x < b.x + brickWidth &&
					y > b.y &&
					y < b.y + brickHeight
				) {
					dy = -dy;
					b.status = 0;
					score++;
					speed += score * 0.01;
					if (score === brickRowCount * brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
						clearInterval(interval); // Needed for Chrome to end game
					}
				}
			}
		}
	}
}
function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText(`Score: ${score}`, 8, 20);
}
const interval = setInterval(draw, 10);
