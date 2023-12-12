import type { Person } from '$lib/types';
import type p5 from 'p5';
import GameEngine from '../';

const UP_ARROW = 38;
const DOWN_ARROW = 40;
const W = 87;
const S = 83;
const ESC = 27;

export class PongGame extends GameEngine {
	private cache: {
		avatars: {
			[key: string]: p5.Image;
		};
	};

	get alphaValue() {
		return this.gameState.status === 'paused' ? 50 : 255;
	}

	private gameState: {
		status: 'paused' | 'running' | 'finished';
		players: {
			x: number;
			y: number;
			score: number;
			input: {
				[key: number]: boolean;
			}[];
			paddle: {
				width: number;
				height: number;
			};
		}[];
		ball: {
			x: number;
			y: number;
			speedX: number;
			speedY: number;
			radius: number;
		};
	};

	constructor(id: number, players: Person[], userId: number) {
		super('Pong', id, '16/9', players, userId, [UP_ARROW, DOWN_ARROW, W, S, ESC]);
		this.gameState = {
			status: 'running',
			players: [],
			ball: {
				x: this.p.width / 2,
				y: this.p.height / 2,
				speedX: 5,
				speedY: 5,
				radius: 10
			}
		};
		this.cache = {
			avatars: {}
		};
	}

	start() {
		console.log('Pong game started', this.playable);
	}

	drawMap() {
		this.p.background(0);
		if (
			typeof this.gameState === 'undefined' ||
			typeof this.gameState.players === 'undefined' ||
			typeof this.gameState.ball === 'undefined' ||
			this.gameState.players.length !== 2
		)
			return;
		this.drawPlayer();
		this.drawMiddleLine();
		this.drawPaddles();
		this.drawBall();
		if (this.gameState.status === 'paused') {
			this.pauseScene();
		}
	}

	update() {}

	// Drawing functions
	private drawMiddleLine() {
		let y = 0;
		while (y < this.p.height) {
			this.p.stroke(255, this.alphaValue);
			this.p.strokeWeight(2);
			this.p.line(this.p.width / 2, y, this.p.width / 2, y + 5);
			y += 10;
		}
	}

	private drawPlayer() {
		this.players.forEach((player, index) => {
			// Draw player avatar
			if (!this.cache.avatars) this.cache.avatars = {};
			if (!this.cache.avatars[player.avatar])
				this.cache.avatars[player.avatar] = this.p.loadImage(player.avatar);
			if (this.gameState.status === 'paused') {
				this.p.tint(255, this.alphaValue);
			} else {
				this.p.noTint();
			}
			this.p.image(
				this.cache.avatars[player.avatar],
				this.p.width / 2 + (index === 0 ? -50 : 0),
				0,
				50,
				50,
				0,
				0,
				0,
				0,
				this.p.COVER
			);

			this.p.textSize(16);
			this.p.textAlign(this.p.CENTER, this.p.CENTER);
			this.p.fill(255, this.alphaValue);
			this.p.stroke(0);
			this.p.text(player.nickname, this.p.width / 2 + (index === 0 ? -100 : 100), 20);

			this.p.textSize(32);
			this.p.textAlign(this.p.CENTER, this.p.CENTER);
			this.p.fill(255, this.alphaValue);
			this.p.text(
				this.gameState.players[index].score,
				this.p.width / 2 + (index === 0 ? -100 : 100),
				50
			);
		});
	}

	private drawPaddles() {
		this.players.forEach((player, index) => {
			this.p.fill(255, this.alphaValue);
			this.p.stroke(0);
			this.p.rect(
				index === 0 ? 0 : this.p.width - this.gameState.players[index].paddle.width,
				this.gameState.players[index].y,
				this.gameState.players[index].paddle.width,
				this.gameState.players[index].paddle.height
			);
		});
	}

	private drawBall() {
		this.p.fill(255, this.alphaValue);
		this.p.stroke(0);
		this.p.ellipse(
			this.gameState.ball.x,
			this.gameState.ball.y,
			this.gameState.ball.radius * 2,
			this.gameState.ball.radius * 2
		);
	}

	public updateState(state: any) {
		this.gameState = state;
		if (
			typeof this.gameState !== 'undefined' &&
			this.gameState.status === 'running' &&
			!this.p.isLooping()
		) {
			this.p.loop();
		}
	}

	// Game scenes
	public pauseScene() {
		this.p.textSize(32);
		this.p.textAlign(this.p.CENTER, this.p.CENTER);
		this.p.fill(255, 255, 255);
		this.p.text('Game paused', this.p.width / 2, this.p.height / 2 - 50);

		// Only show pause menu if game is playable (i.e. user is a player)
		if (this.playable) {
			// Show pause menu
			this.p.textSize(16);
			this.p.textAlign(this.p.CENTER, this.p.CENTER);
			this.p.fill(255, 255, 255);
			this.p.text('Press ESC to resume', this.p.width / 2, this.p.height / 2);

			// Show controls
			this.p.textSize(16);
			this.p.textAlign(this.p.CENTER, this.p.CENTER);
			this.p.fill(255, 255, 255);
			this.p.text('Controls:', this.p.width / 2, this.p.height / 2 + 25);
			this.p.text('Player 1: W and S', this.p.width / 2, this.p.height / 2 + 50);
			this.p.text('Player 2: UP and DOWN', this.p.width / 2, this.p.height / 2 + 75);
		}
	}
}
