import type { Person } from '$lib/types';
import { GamesSocket } from '$services/socket';
import p5 from 'p5';

export default class GameEngine {
	public name: string;
	public id: number;
	public p: p5;
	private gameId: number;
	private aspectRatio: string;
	protected players: Person[];
	protected playable: boolean = false;
	protected userId: number;
	protected keyInputHandlers: number[] = [];

	protected keyInput: [number, boolean][];

	constructor(
		name: string,
		gameId: number,
		aspectRatio: string,
		players: Person[],
		userId: number,
		keyInputHandlers: number[]
	) {
		this.id = gameId;
		this.name = name;
		this.gameId = gameId;
		this.players = players;
		this.playable = this.players?.some((player) => player.id === userId);
		this.userId = userId;
		this.keyInputHandlers = keyInputHandlers;
		if (aspectRatio) {
			if (!/^\d+\/\d+$/.test(aspectRatio)) {
				throw new Error('Invalid aspect ratio');
			}
			this.aspectRatio = aspectRatio;
		}
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

	protected getGame() {
		return this.name;
	}

	protected start() {
		// Additional initialization or starting game logic
	}
}
