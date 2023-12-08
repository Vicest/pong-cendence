import { browser } from '$app/environment';
import p5 from 'p5';

export default class GameEngine {
	private name: string;
	public p: p5;
	private gameId: number;
	private aspectRatio: string = '16 / 9';

	constructor(name: string, gameId: number, aspectRatio?: string) {
		this.name = name;
		this.gameId = gameId;
		if (aspectRatio) this.aspectRatio = aspectRatio;
		this.p = new p5(this.init.bind(this));
		this.start();
	}

	private init(p: p5) {
		let canvas: p5.Renderer;

		p.setup = () => {
			let parentElement = document.getElementById(`game-${this.gameId}`);
			if (!parentElement) {
				throw new Error(`Game with id ${this.gameId} does not exist`);
			}
			canvas = p.createCanvas(1024, 600);
			canvas.parent(`#game-${this.gameId}`);

			let _canvas = parentElement.querySelector('canvas');
			_canvas.style.aspectRatio = this.aspectRatio;
			_canvas.style.width = `min(100%,100vh * ${this.aspectRatio.split('/')[0]} / ${
				this.aspectRatio.split('/')[1]
			})`;
			_canvas.style.height = '';
		};

		p.windowResized = () => {
			/*let parentElement = document.getElementById(`game-${this.gameId}`);
			let canvasElement = document.querySelector(`#game-${this.gameId} canvas`);
			if (!parentElement || !canvasElement) {
				throw new Error(`Game with id ${this.gameId} does not exist`);
			}
			canvasElement.style.display = 'none';
			let canvasElementWidth = canvasElement.width;
			let calculatedDimensions = this.fitRectIntoContainer(
				Number(this.aspectRatio.split('/')[0]),
				Number(this.aspectRatio.split('/')[1]),
				parentElement.clientWidth,
				parentElement.clientHeight
			);
			canvasElement.style.display = 'block';
			canvasElement.style.scale = `calc(${calculatedDimensions.width / calculatedDimensions.height}`;*/
		};
	}

	protected getGame() {
		return this.name;
	}

	protected start() {
		// Additional initialization or starting game logic
	}

	private fitRectIntoContainer = (
		rectWidth: number,
		rectHeight: number,
		containerWidth: number,
		containerHeight: number
	) => {
		const widthRatio = containerWidth / rectWidth; // ratio container width to rect width
		const heightRatio = containerHeight / rectHeight; // ratio container height to rect height

		const ratio = Math.min(widthRatio, heightRatio); // take the smaller ratio

		// new rect width and height, scaled by the same ratio
		return {
			width: rectWidth * ratio,
			height: rectHeight * ratio
		};
	};
}
