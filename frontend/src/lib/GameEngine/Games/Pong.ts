import type { GameInstance, Person } from '$lib/types';
import type p5 from 'p5';
import GameEngine from '../';
import { GamesSocket } from '$services/socket';

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
		return ['paused', 'finished'].includes(this.gameState.status) ? 50 : 255;
	}

	private gameState: {
		status: 'paused' | 'running' | 'finished' | 'waiting';
		countdown: number;
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
			avatar?: string;
		}[];
		ball: {
			x: number;
			y: number;
			speedX: number;
			speedY: number;
			radius: number;
		};
	};

	constructor(game: GameInstance, players: Person[], userId: number) {
		super('Pong', game, '16/9', players, userId, [UP_ARROW, DOWN_ARROW, W, S, ESC]);
		this.gameState = {
			status: game.status,
			countdown: 0,
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

	start() {}

	drawMap() {
		this.p.background(0);
		this.p.noCursor();
		if (this.gameState.status === 'finished') {
			this.p.textSize(32);
			this.p.textAlign(this.p.CENTER, this.p.CENTER);
			this.p.fill(255, 255, 255);
			this.p.text('Game finished', this.p.width / 2, this.p.height / 2 - 50);
		}
		if (
			typeof this.gameState === 'undefined' ||
			typeof this.gameState.players === 'undefined' ||
			typeof this.gameState.ball === 'undefined' ||
			this.gameState.players.length !== 2
		)
			return;
		if (this.gameState.status === 'paused') {
			this.pauseScene();
		}
		this.drawPlayer();
		this.drawMiddleLine();
		this.drawPaddles();
		this.drawBall();
		if (this.gameState.status === 'paused') {
			this.pauseScene();
		} else if (this.gameState.status === 'waiting') {
			this.waitingScene();
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
			if (player.avatar && !this.cache.avatars[player.avatar])
				this.cache.avatars[player.avatar] = this.p.loadImage(player.avatar);
			if (this.gameState.status === 'paused') {
				this.p.tint(255, this.alphaValue);
			} else {
				this.p.noTint();
			}
			if (player.avatar && this.cache.avatars[player.avatar])
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
			this.p.text('W and S', this.p.width / 2, this.p.height / 2 + 50);
		}
	}

	public waitingScene() {
		this.p.textSize(32);
		this.p.textAlign(this.p.CENTER, this.p.CENTER);
		this.p.fill(255, 255, 255);
		this.p.text(
			`Game starting in ${Math.ceil(this.gameState.countdown / 1000)}.`,
			this.p.width / 2,
			this.p.height / 2 - 50
		);
	}

	public destroy() {
		this.p.noLoop();
		this.p.remove();
		this.playable = false;
		GamesSocket.emit('leave', this.id);
	}
}
