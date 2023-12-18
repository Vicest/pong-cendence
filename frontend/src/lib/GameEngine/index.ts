import type { GameInstance, Person } from '$lib/types';
import { GamesSocket } from '$services/socket';
import p5 from 'p5';
import type { Socket } from 'socket.io-client';

export default class GameEngine {
	public name: string;
	public gameInstance: GameInstance;
	public p: p5;
	private gameId: number;
	private aspectRatio: string;
	public players: Person[];
	public playable: boolean = false;
	protected userId: number;
	protected keyInputHandlers: number[] = [];
	protected socket: Socket;

	protected keyInput: [number, boolean][];

	constructor(
		name: string,
		gameInstance: GameInstance,
		aspectRatio: string,
		players: Person[],
		userId: number,
		keyInputHandlers: number[]
	) {
		this.gameInstance = gameInstance;
		this.name = name;
		this.gameId = gameInstance.id;
		this.players = players;
		this.playable = this.players?.some((player) => player.id === userId);
		this.userId = userId;
		this.keyInputHandlers = keyInputHandlers;
		this.keyInput = this.keyInputHandlers.map((key) => {
			return [key, false];
		});
		if (aspectRatio) {
			if (!/^\d+\/\d+$/.test(aspectRatio)) {
				throw new Error('Invalid aspect ratio');
			}
			this.aspectRatio = aspectRatio;
		}
		GamesSocket.emit('join', this.gameId, (data) => {
			console.log(data);
		});
		this.p = new p5(this.init.bind(this));
		this.p.frameRate(60);
		this.start();
	}

	private init(p: p5) {
		p.setup = () => {
			this.p = p;
			this.SetupCanvas();
		};

		p.draw = () => {
			this.drawMap();
			if (this.playable) this.handleInput();
		};

		p.windowResized = () => {};

		GamesSocket.on('tick', (data) => {
			if (data.gameId !== this.gameId) return;
			this.updateState(data.state);
		});
	}

	protected drawMap() {}

	protected handleInput() {
		if (!this.playable) return;
		let newKeyInput = this.keyInputHandlers.map((key) => {
			return [key, this.p.keyIsDown(key)];
		});
		if (JSON.stringify(newKeyInput) === JSON.stringify(this.keyInput)) return;
		this.keyInput = newKeyInput;
		GamesSocket.emit('input', {
			gameId: this.gameId,
			data: this.keyInputHandlers.map((key) => {
				return { [key]: this.p.keyIsDown(key) };
			})
		});
	}

	protected updateState(state: any) {}

	protected SetupCanvas() {
		const parentElement = document.getElementById(`game-${this.gameId}`);
		if (!parentElement) {
			throw new Error(`Game with id ${this.gameId} does not exist`);
		}
		const canvas = this.p.createCanvas(1024, 600);
		canvas.parent(`#game-${this.gameId}`);
		const _canvas = parentElement.querySelector('canvas');
		if (!_canvas) {
			throw new Error(`Canvas for game with id ${this.gameId} does not exist`);
		}
		_canvas.style.aspectRatio = this.aspectRatio;
		_canvas.style.width = `min(100%,100vh * ${this.aspectRatio.split('/')[0]} / ${
			this.aspectRatio.split('/')[1]
		})`;
		_canvas.style.height = '';
	}

	protected resetGame() {
		GamesSocket.emit('reset', this.gameId);
	}

	protected getGame() {
		return this.name;
	}

	protected start() {
		// Additional initialization or starting game logic
	}
}
