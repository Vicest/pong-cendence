import GameEngine from '../';

export class PongGame extends GameEngine {
	private keysPressed: any;
	private ball: any;
	private leftPaddle: any;
	private rightPaddle: any;
	private playerSpeed: number;
	private upKey: number;
	private downKey: number;
	private upArrow: number;
	private downArrow: number;

	constructor(id) {
		super('Pong', id, '16 / 9');
		this.keysPressed = {};
		this.ball = {
			x: 400,
			y: 300,
			speedX: 5,
			speedY: 5,
			radius: 10
		};
		this.leftPaddle = {
			y: 250,
			height: 100,
			width: 10
		};
		this.rightPaddle = {
			y: 250,
			height: 100,
			width: 10
		};
		this.playerSpeed = 10;
		this.upKey = 87; // W key
		this.downKey = 83; // S key
		this.upArrow = 38; // Up arrow key
		this.downArrow = 40; // Down arrow key
	}

	start() {
		console.log('Starting Pong');
		const self = this;
		this.p.draw = () => {
			this.p.background(0);
			this.update();
			this.drawBall();
			this.drawPaddles();
		};

		this.p.keyPressed = () => {
			this.keysPressed[this.p.keyCode] = true;
		};

		this.p.keyReleased = () => {
			this.keysPressed[this.p.keyCode] = false;
		};
	}

	handleInput() {
		if (this.keysPressed[this.upKey]) {
			this.movePaddle(this.leftPaddle, -this.playerSpeed);
		} else if (this.keysPressed[this.downKey]) {
			this.movePaddle(this.leftPaddle, this.playerSpeed);
		}
		if (this.keysPressed[this.upArrow]) {
			this.movePaddle(this.rightPaddle, -this.playerSpeed);
		} else if (this.keysPressed[this.downArrow]) {
			this.movePaddle(this.rightPaddle, this.playerSpeed);
		}
	}

	update() {
		this.moveBall();
		this.checkCollision();
		this.handleInput();
	}

	drawBall() {
		this.p.fill(255);
		this.p.ellipse(this.ball.x, this.ball.y, this.ball.radius * 2);
	}

	drawPaddles() {
		this.p.fill(255);
		this.p.rect(0, this.leftPaddle.y, this.leftPaddle.width, this.leftPaddle.height);
		this.p.rect(
			this.p.width - this.rightPaddle.width,
			this.rightPaddle.y,
			this.rightPaddle.width,
			this.rightPaddle.height
		);
	}

	movePaddle(paddle, dir) {
		paddle.y += dir;
		paddle.y = this.p.constrain(paddle.y, 0, this.p.height - paddle.height);
		console.log('hola');
	}

	moveBall() {
		this.ball.x += this.ball.speedX;
		this.ball.y += this.ball.speedY;

		if (this.ball.y <= 0 || this.ball.y >= this.p.height) {
			this.ball.speedY *= -1;
		}

		const paddle = this.ball.speedX > 0 ? this.rightPaddle : this.leftPaddle;

		if (
			this.ball.x - this.ball.radius <= this.leftPaddle.width &&
			this.ball.y >= this.leftPaddle.y &&
			this.ball.y <= this.leftPaddle.y + this.leftPaddle.height
		) {
			this.ball.speedX *= -1;
		} else if (
			this.ball.x + this.ball.radius >= this.p.width - this.rightPaddle.width &&
			this.ball.y >= paddle.y &&
			this.ball.y <= paddle.y + paddle.height
		) {
			this.ball.speedX *= -1;
		}
	}

	checkCollision() {
		if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.p.width) {
			this.ball.x = this.p.width / 2;
			this.ball.y = this.p.height / 2;
		}
	}
}
