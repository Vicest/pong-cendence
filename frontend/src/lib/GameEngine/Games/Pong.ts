import type { Person } from '$lib/types';
import { GamesSocket } from '$services/socket';
import GameEngine from '../';

export class PongGame extends GameEngine {
	private keysPressed: any;
	private _keysPressed: any;
	private ball: any;
	private leftPaddle: any;
	private rightPaddle: any;
	private playerSpeed: number;
	private upKey: number;
	private downKey: number;
	private upArrow: number;
	private downArrow: number;

	constructor(id: number, players: Person[], userId: number) {
		super('Pong', id, '16/9', players, userId);
		this.keysPressed = {};
		this._keysPressed = {};

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

		GamesSocket.on('IoEvent', (data: any) => {
			if (data.game === self.id) {
				self._keysPressed = data.users.reduce((acc: any, user: any) => {
					console.log(user);
					if (user.user_id === 1) {
						acc[self.upKey] = user.properties[self.upKey];
						acc[self.downKey] = user.properties[self.downKey];
					} else if (user.user_id === 2) {
						acc[self.upArrow] = user.properties[self.upArrow];
						acc[self.downArrow] = user.properties[self.downArrow];
					}
					return acc;
				}, {});
			}
		});
	}

	handleInput() {
		GamesSocket.emit('IoEvent', {
			game: this.id,
			keysPressed: this.keysPressed
		});
	}

	handleSocketInput() {
		if (this._keysPressed[this.upKey]) {
			this.movePaddle(this.leftPaddle, -this.playerSpeed);
		} else if (this._keysPressed[this.downKey]) {
			this.movePaddle(this.leftPaddle, this.playerSpeed);
		}
		if (this._keysPressed[this.upArrow]) {
			this.movePaddle(this.rightPaddle, -this.playerSpeed);
		} else if (this._keysPressed[this.downArrow]) {
			this.movePaddle(this.rightPaddle, this.playerSpeed);
		}
	}

	update() {
		this.moveBall();
		this.checkCollision();
		if (this.players.map((p) => p.id).indexOf(this.userId) !== -1) {
			this.handleInput();
		}
		this.handleSocketInput();
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
