import { Logger } from '@nestjs/common';
import { Match } from '../entities/match.entity';
import { EventEmitter } from 'stream';

type PongInstanceInput = {
	[key: number]: boolean;
};

type State = {
	status: 'paused' | 'running' | 'finished' | 'waiting';
	countdown: number;
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
	private static readonly paddlesWidth = 10;
	private static readonly paddlesHeight = 100;
	private static readonly ballRadius = 5;
	private static readonly ballSpeed = 4;
	private static readonly scoreToWin = 1;
	private static readonly waitingTime = 5000;

	private log: Logger;
	private players: Match['players'];
	private events: Match['events'];
	private state: State;
	private match: Match;

	constructor(match: Match) {
		super();
		this.log = new Logger();
		this.match = match;
		this.players = match.players;
		this.events = match.events;
		this.state = {
			status: 'waiting',
			countdown: PongInstance.waitingTime,
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
				speedX: PongInstance.ballSpeed * (Math.floor(Math.random() * 2) * 2 - 1),
				speedY: PongInstance.ballSpeed * (Math.floor(Math.random() * 2) * 2 - 1),
				radius: PongInstance.ballRadius
			}
		};
		this.state.players[1].x = PongInstance.canvasWidth;
		this.log.debug('Pong instance created', this.constructor.name);
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
			if (this.state.status === 'paused')
				this.state.status = 'running';
			else if (this.state.status === 'running')
				this.state.status = 'paused';
		}
	}

	private score(scorer) {
		scorer.score += 1;
		this.state.ball.x = PongInstance.canvasWidth / 2;
		this.state.ball.y = PongInstance.canvasHeight / 2;
		this.state.ball.speedX = PongInstance.ballSpeed * (Math.floor(Math.random() * 2) * 2 - 1);
		this.state.ball.speedY = PongInstance.ballSpeed * (Math.floor(Math.random() * 2) * 2 - 1);
	}

	private hitsPaddle(player): boolean {
		const lamda = (player.x - this.state.ball.x) / this.state.ball.speedX;
		const yCollision = this.state.ball.y + (lamda * this.state.ball.speedY);
		return (yCollision >= player.y && yCollision <= player.y + player.paddle.height);
	}

	private moveBall() {
		let newX = this.state.ball.x + this.state.ball.speedX;
		let newY = this.state.ball.y + this.state.ball.speedY;


		// Walls collision
		if (newY < 0) {
			newY = -newY;
			this.state.ball.speedY *= -1;
		} else if (newY > PongInstance.canvasHeight) {
			newY = PongInstance.canvasHeight - (newY - PongInstance.canvasHeight)
			this.state.ball.speedY *= -1;
		}

		//Paddle collision
		if (newX < 0) {
			if (this.hitsPaddle(this.state.players[0])) {
				newX = -newX;
				this.state.ball.speedX *= -1;
			} else {
				this.score(this.state.players[1]);
				return ;
			}
		} else if (newX > PongInstance.canvasWidth) {
			if (this.hitsPaddle(this.state.players[1])) {
				newX = PongInstance.canvasWidth - (newX - PongInstance.canvasWidth)
				this.state.ball.speedX *= -1;
			} else {
				this.score(this.state.players[0]);
				return ;
			}
		}
		this.state.ball.x = newX;
		this.state.ball.y = newY;
	}

	private checkScore() {
		this.players.forEach((player, index) => {
			if (this.state.players[index].score > PongInstance.scoreToWin) {
				this.state.status = 'finished';
			}
		});
	}

	public updateState() {
		if (['paused', 'finished'].includes(this.state.status)) {
			return;
		}
		if (this.state.status === 'waiting') {
			this.state.countdown =
				this.match.created_at.getTime() + PongInstance.waitingTime - Date.now();
			if (this.state.countdown <= 0)
				this.state.status = 'running';
			return;
		}
		this.movePaddles();
		this.moveBall();
		this.checkScore();
	}

	public reset() {
		this.state = {
			status: 'running',
			countdown: PongInstance.waitingTime,
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
	}

	public getState() {
		return this.state;
	}
}
