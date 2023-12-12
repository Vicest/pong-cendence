import { Logger } from '@nestjs/common';
import { Match } from '../entities/match.entity';
import { EventEmitter } from 'stream';

type PongInstanceInput = {
	[key: number]: boolean;
};

type State = {
	status: 'paused' | 'running' | 'finished';
	players: {
		x: number;
		y: number;
		score: number;
		input: PongInstanceInput[];
		paddle: {
			width: number;
			height: number;
		};
		ping: number;
	}[];
	ball: {
		x: number;
		y: number;
		speedX: number;
		speedY: number;
		radius: number;
	};
};

export class PongInstance extends EventEmitter {
	public static readonly slug = 'pong';

	private static readonly canvasWidth = 1024;
	private static readonly canvasHeight = 600;
	private static readonly paddlesWidth = 5;
	private static readonly paddlesHeight = 100;
	private static readonly ballRadius = 5;
	private static readonly ballSpeed = 4;

	private log: Logger;
	private players: Match['players'];
	private events: Match['events'];
	private state: State;

	constructor(match: Match) {
		super();
		this.log = new Logger();
		this.players = match.players;
		this.events = match.events;
		this.state = {
			status: 'running',
			players: this.players.map(() => ({
				x: 0,
				y: PongInstance.canvasHeight / 2 - PongInstance.paddlesHeight / 2,
				score: 0,
				input: [],
				paddle: {
					width: PongInstance.paddlesWidth,
					height: PongInstance.paddlesHeight
				},
				ping: 0
			})),
			ball: {
				x: PongInstance.canvasWidth / 2,
				y: PongInstance.canvasHeight / 2,
				speedX: PongInstance.ballSpeed,
				speedY: PongInstance.ballSpeed,
				radius: PongInstance.ballRadius
			}
		};
		this.log.debug('Pong instance created', this.constructor.name);
	}

	private checkCollision() {
		// Left collision
		if (this.state.ball.x - this.state.ball.radius < 0) {
			this.state.players[1].score += 1;
			this.state.ball.x = PongInstance.canvasWidth / 2;
			this.state.ball.y = PongInstance.canvasHeight / 2;
		}
		// Right collision
		if (this.state.ball.x + this.state.ball.radius > PongInstance.canvasWidth) {
			this.state.players[0].score += 1;
			this.state.ball.x = PongInstance.canvasWidth / 2;
			this.state.ball.y = PongInstance.canvasHeight / 2;
		}
	}

	private movePaddles() {
		this.players.forEach((player, index) => {
			let isUp = this.state.players[index].input.some((input) => input[87]);
			let isDown = this.state.players[index].input.some((input) => input[83]);
			if (this.state.players[index].y <= 0) {
				isUp = false;
			} else if (
				this.state.players[index].y >=
				PongInstance.canvasHeight - PongInstance.paddlesHeight
			) {
				isDown = false;
			}
			if (isUp) {
				this.state.players[index].y -= 10;
			}
			if (isDown) {
				this.state.players[index].y += 10;
			}
		});
	}

	public handleInput(userId: number, data: PongInstanceInput[]) {
		const index = this.players.findIndex((player) => player.id === userId);
		this.state.players[index].input = data;
		if (data.some((input) => input[27])) {
			this.state.status = this.state.status === 'paused' ? 'running' : 'paused';
		}
	}

	private moveBall() {
		this.state.ball.x += this.state.ball.speedX;
		this.state.ball.y += this.state.ball.speedY;
		// Walls collision
		if (this.state.ball.y - this.state.ball.radius < 0) {
			this.state.ball.speedY *= -1; // Reverse ball speed
		}
		if (
			this.state.ball.y + this.state.ball.radius >
			PongInstance.canvasHeight
		) {
			this.state.ball.speedY *= -1;
		}
		// Left collision
		if (this.state.ball.x - this.state.ball.radius < 0) {
			this.state.ball.speedX *= -1;
		}
		// Right collision
		if (this.state.ball.x + this.state.ball.radius > PongInstance.canvasWidth) {
			this.state.ball.speedX *= -1;
		}

		// Paddles collision
		this.players.forEach((player, index) => {
			// If ball is on the left side of the canvas
			if (
				this.state.ball.x - this.state.ball.radius <
					PongInstance.paddlesWidth &&
				this.state.ball.y >= this.state.players[index].y &&
				this.state.ball.y <=
					this.state.players[index].y + PongInstance.paddlesHeight
			) {
				this.state.ball.speedX *= -1;
			}
			// If ball is on the right side of the canvas
			if (
				this.state.ball.x + this.state.ball.radius >
					PongInstance.canvasWidth - PongInstance.paddlesWidth &&
				this.state.ball.y >= this.state.players[index].y &&
				this.state.ball.y <=
					this.state.players[index].y + PongInstance.paddlesHeight
			) {
				this.state.ball.speedX *= -1;
			}
		});
	}

	public updateState() {
		if (this.state.status === 'paused') {
			return;
		}
		this.movePaddles();
		this.checkCollision();
		this.moveBall();
	}

	public getState() {
		return this.state;
	}
}
