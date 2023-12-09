import { browser } from '$app/environment';
import type { Person } from '$lib/types';
import p5 from 'p5';
import type { p5InstanceExtensions } from 'p5';

export default class GameEngine {
	public name: string;
	public id: number;
	public p: p5;
	private gameId: number;
	private aspectRatio: string = '16/9';
	protected players: Person[];
	protected userId: number;

	constructor(
		name: string,
		gameId: number,
		aspectRatio?: string,
		players?: Person[],
		userId?: number
	) {
		this.id = gameId;
		this.name = name;
		this.gameId = gameId;
		this.players = players;
		this.userId = userId;
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
		let canvas: p5.Renderer;

		p.setup = () => {
			this.p = p;
			this.SetupCanvas();
			this.SetupListeners();
		};

		p.windowResized = () => {};
	}

	protected SetupListeners() {}

	protected SetupCanvas() {
		let canvas: p5.Renderer;

		let parentElement = document.getElementById(`game-${this.gameId}`);
		if (!parentElement) {
			throw new Error(`Game with id ${this.gameId} does not exist`);
		}
		canvas = this.p.createCanvas(1024, 600);
		canvas.parent(`#game-${this.gameId}`);
		let _canvas = parentElement.querySelector('canvas');
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
