import { MatchResultDto } from '../../dtos'
import { Vector, Matrix } from 'ts-matrix'

type Point = Vector

function inRange(value:number, rangeBegin:number, rangeEnd:number): boolean {
//	console.log(`Range check: ${value} e (${rangeBegin}, ${rangeEnd})`) TODO verbose logger
	return value >= rangeBegin && value <= rangeEnd
}

class LineSegment {
	public constructor(origin:Point, end:Point, end_is_vector:boolean) {
		this.origin_ = new Vector(origin.values)
		this.direction_ = new Vector(end.values)
		if (!end_is_vector) this.direction_ = this.direction_.substract(origin)
	}

	get origin():Vector {
		return this.origin_
	}

	get direction():Vector {
		return this.direction_
	}

	get length():number {
		return this.direction_.length()
	}

	set origin(origin:Point) {
		this.origin_ = origin
	}

	//TODO TYPE anotation
	public intersection(origin:Point, direction:Vector) {
		//TODO if parallel.
//		const [xCollision, yCollision]:[number,number] = this.solveQuadratic(origin, direction)
		const collision:Point = new Vector(this.solveQuadratic(origin, direction))
		//TODO Can reclaim this if return value is not just a boolean.
//		if (inRange(ballDisplacement, 0, direction.length) && inRange(wallOffset, 0, this.length))
//			return true; //TODO return something that allows a better re-calculation
//		return false;
		return {
			inSegment:(
				inRange(collision.substract(origin).length(), 0, direction.length())
				&& collision.substract(origin).dot(direction) > 0
				&& inRange(collision.substract(this.origin).length(), 0, this.direction.length())
				&& collision.substract(this.origin).dot(this.direction) > 0),
			coords:collision,
		}
	}

	public reflect(incidencePoint:Point, source:Point):Point {
		//TODO translation before reflection
		let reflectedPoint:Point = new Vector(source.values).substract(incidencePoint)
		//----
		//TODO other private function?
		//TODO MATH
		//TODO precalculate the stuff
		//TODO This assumes y(perpendicular.at(0)) != 0 again precalculation is better
		const perpendicular:Vector = new Vector([
			this.direction.at(1),
			-this.direction.at(0),
		])

		let reflMatrix:Matrix = new Matrix(2, 2)
		//TODO hold for preclaculations
		if (perpendicular.at(0) == 0) {
			reflMatrix.values = [
				[-1, 0],
				[0, 1],
			]
		} else {

			const slope:number = Math.tan(perpendicular.at(1) / perpendicular.at(0))
			const commonFactor:number = 1 / (1 + Math.pow(slope, 2))

			reflMatrix.values = [
				[commonFactor * (1 - Math.pow(slope, 2)), commonFactor * 2 * slope],
				[commonFactor * 2 * slope, commonFactor * (Math.pow(slope, 2) - 1)],
			]
		}
		//--- TODO
		const reflectedPointAsMatrix:Matrix = reflMatrix.multiply(new Matrix(2, 1, [[reflectedPoint.at(0)], [reflectedPoint.at(1)]]))
		//TODO translation after reflection
		reflectedPoint.values = [
			reflectedPointAsMatrix.at(0, 0),
			reflectedPointAsMatrix.at(1, 0),
		]
		reflectedPoint = reflectedPoint.add(incidencePoint)
		//----
		return reflectedPoint
	}

	private origin_: Point
	private direction_: Vector

	/*TODO Comment the math.
		Set in place the equation system
		then just explain/include Cramer's method.
	*/
	//TODO maybe change parameter names
	private solveQuadratic(origin:Point, direction:Vector): [number, number] { //TODO Cramer
		const xColumn:Vector = new Vector([direction.at(1), this.direction.at(1)])
		const yColumn:Vector = new Vector([-direction.at(0), -this.direction.at(0)])
		const constantTermColumn:Vector = new Vector([
			direction.at(1) * origin.at(0) - direction.at(0) * origin.at(1),
			this.direction.at(1) * this.origin.at(0) - this.direction.at(0) * this.origin.at(1),
		])
		let temporaryMatrixName:Matrix = new Matrix(2, 2, [xColumn.values, yColumn.values])//FIXME really, change the name
		const divisor:number = temporaryMatrixName.determinant()

		if (divisor == 0)
			throw new Error('Solve Q for paralell lines.')
//			return [0, 0]//FIXME Parallel, so... prrrf handle this.

		temporaryMatrixName.values = [constantTermColumn.values, yColumn.values]
		const xCollision:number = temporaryMatrixName.determinant() / divisor

		temporaryMatrixName.values = [xColumn.values, constantTermColumn.values]
		const yCollision = temporaryMatrixName.determinant() / divisor
		return [xCollision, yCollision]
	}

	/*
		The formula to get a point's symmetry across one line:
		https://math.stackexchange.com/questions/525082/reflection-across-a-line
		It assumes the line to cross the origin, we translate the point to fix it.
	*/
 //TODO half-dupe in public, don't blame me, I am sleep deprived
	private reflectPoint(point: Point):Point {
		//TODO MATH
		//TODO precalculate the stuff
		//TODO This assumes x != 0 again precalculation is better
		let slope:number = Math.tan(this.direction.at(1) / this.direction.at(0))
		let commonFactor:number = 1 / (1 + Math.pow(slope, 2))
		let reflMatrix:Matrix = new Matrix(2, 2, [
			[commonFactor * (1 - Math.pow(slope, 2)), commonFactor * 2 * slope],
			[commonFactor * 2 * slope, commonFactor * (Math.pow(slope, 2) - 1)],
		])
		//--- TODO
		let refectedPointAsMatrix:Matrix = reflMatrix.multiply(new Matrix(2, 1, [[point.at(0)], [point.at(1)]]))
		return new Vector([refectedPointAsMatrix.at(0, 0), refectedPointAsMatrix.at(0, 1)])
	}
}

//FIXME A class or justan ad-hoc class definition?
export class matchStatus {
	paddlePosition: [number, number]
	paddleSize: [number, number]
	ball: [number, number]
	score: [number, number]
}

class Paddle {
	public constructor(player: string, corner:Point, length:number) {
		this.id_ = player;
		this.line_ = new LineSegment(corner, new Vector([0, length]), true)
		this.momentum_ = 0;
		//Move Range //TODO Separate class?
		this.moveRangeMax_ = 10; //FIXME Not harcoded
		this.moveRangePosition_ = (this.moveRangeMax_ + this.line_.length) / 2;
	}

	get id():string {
		return this.id_;
	}

	get line():LineSegment {
		return this.line_;
	}

	get momentum():number {
		return this.momentum_
	}

	public move(distance: number): void {
		let moveDistance:number = distance;
		if (moveDistance + this.moveRangePosition_ < 0)
			moveDistance = -this.moveRangePosition_;
		else if (moveDistance + this.moveRangePosition_ + this.line_.length > this.moveRangeMax_)
			moveDistance = this.moveRangeMax_ - this.line_.length - this.moveRangePosition_;

		let moveVector:Vector = new Vector(this.line_.direction.values);
		moveVector = moveVector.scale(moveDistance);
		this.line_.origin = this.line_.origin.add(moveVector);
	}

	public clearMomentum(): void {
		this.momentum_ = 0;
	}

	private readonly id_:string;
	private line_:LineSegment;
	//Moving the paddle right before a hit can affect the way it collides.
	private momentum_:number;
	//Move Range Properties
	private readonly moveRangeMax_:number
	private moveRangePosition_:number

}

export class Match {
	constructor(players:[string, string], targetScore:[number, number] = [5, 5]) {//FIXME Tragett score
		//Constants
		this.width = 10
		this.height = 10
		this.paddleLength = 2//TODO Maybe one for each player
		this.winScore = targetScore
		//End-Constants
		const startHeight:number = (this.height - this.paddleLength) / 2
		this.players = [
			new Paddle(players[0], new Vector([0, startHeight]), this.paddleLength),
			new Paddle(players[1], new Vector([this.width, startHeight]), this.paddleLength)
		]
		this.map = [
			new LineSegment(new Vector([0, 0]), new Vector([this.width, 0]), false),//FIXME DEBUG
			new LineSegment(new Vector([0, this.height]), new Vector([this.width, this.height]), false),
		]
		this.score = [0, 0]
		this.ball = new Vector([0, 0])
		this.ballVector = new Vector([0, 0])
		this.newBall()
	}

	//TODO do it with the player move range
	public playerInput(player: string, distance: number) {
		if (this.players[0].id == player)
			this.players[0].move(distance)
		else if (this.players[1].id == player)
			this.players[1].move(distance)
		else
			console.log("Ah, player interaction! *hides in a corner*");
	}

	public playing(user: string):boolean {
		return this.players[0].id == user || this.players[1].id == user;
	}

	/*
	*	Notifies relevant changes in game status:
	*	0: No change
	*	-1: P1 scored a match point
	*	-2: P2 scored a match point
	*/
 //FIXME This logic right now is completely broken.
	public gameTick():number {
		//FIXME annotate types
		let chivato:boolean = false
		for (let wall of this.map) {
			const lineIntersection = wall.intersection(this.ball, this.ballVector)
			if (lineIntersection.inSegment) {
				const reflected:Point = wall.reflect(lineIntersection.coords, this.ball)
				const displacementToCollision:number = lineIntersection.coords.substract(this.ball).length()
				const displacementAfterCollision:number = this.ballVector.length() - displacementToCollision
				const ballSpeed = this.ballVector.length()
				//Go to collision
				this.ball = this.ball.add(this.ballVector.normalize().scale(displacementToCollision))
				this.ballVector = reflected.substract(lineIntersection.coords)
				//Redirect after collision and move
				this.ballVector = this.ballVector.normalize().scale(displacementAfterCollision)
				this.ball = this.ball.add(this.ballVector)
				//Rebuild the vector
				this.ballVector = reflected.substract(lineIntersection.coords)
				this.ballVector = this.ballVector.normalize().scale(ballSpeed)
//------OLD FIXME
				//FIXME use the right vector lenght
//				this.ball.values = reflected.values
//				this.ballVector = lineIntersection.coords.substract(this.ball)
//				this.ballVector = this.ball.substract(lineIntersection.coords)
//END OLD FIXME
				chivato = true
				break //FIXME get shortest distance colllision.
			}
		}
		if (!chivato) {
			//FIXME Duplicate code from the previous intersects
			for (let paddle of [this.players[0].line, this.players[1].line]) {
				const lineIntersection = paddle.intersection(this.ball, this.ballVector)
				if (lineIntersection.inSegment) {
					const reflected:Point = paddle.reflect(lineIntersection.coords, this.ball)
					const displacementToCollision:number = lineIntersection.coords.substract(this.ball).length()
					const displacementAfterCollision:number = this.ballVector.length() - displacementToCollision
					const ballSpeed = this.ballVector.length()
					//Go to collision
					this.ball = this.ball.add(this.ballVector.normalize().scale(displacementToCollision))
					this.ballVector = reflected.substract(lineIntersection.coords)
					//Redirect after collision and move
					this.ballVector = this.ballVector.normalize().scale(displacementAfterCollision)
					this.ball = this.ball.add(this.ballVector)
					//Rebuild the vector
					this.ballVector = reflected.substract(lineIntersection.coords)
					this.ballVector = this.ballVector.normalize().scale(ballSpeed)
					//
					chivato = true
				}
			}
		}
		/*
		let intersects:boolean;
		//TODO so... this is actually just a standard while?
		do {
			intersects = false;
			//TODO Handle map and paddles differently
			for (let wall of ([this.map, this.players[0].line, this.players[1].line]).flat()) {
				if (wall.intersects(this.ball, this.ballVector)) {
					//TODO, do something hold temporary ball and vector values.
					//wall.rebound (probably rotations, go, math, go!)
					//add[intersectionDistance, wall];
					//Keep the min(intersectionDistance)
					//TODO re include momentum
					intersects = true;
					break ;
				}
			}
		} while (intersects *//* TODO && tmpBallDir.length > 0 *//*);
		*/
		//Unhindered move
		if (!chivato) //DEBUG remove TODO
			this.ball.values = this.ball.add(this.ballVector).values
		//FIXME
		//FIXME Paddles shold reposition to center.
		if (this.ball.at(0) < 0) { //P1 TODO clean
			this.score[1] += 1;
			if (this.score[1] == this.winScore[1]) {
				return -2;
			} else {
				this.newBall();
				return 0;
			}
		} else if (this.ball.at(0) > this.width) { //P2 TODO clean
			this.score[0] += 1;
			if (this.score[0] == this.winScore[0]) {
				return -1;
			} else {
				this.newBall();
				return 0;
			}
		}
		//FIXME
		this.players[0].clearMomentum();
		this.players[1].clearMomentum();
		return 0;
		//END
	}

	public status(): matchStatus {
		//TODO do nicely, pls
		let retStatus:matchStatus = new matchStatus
		retStatus.paddlePosition = [//FIXME Check if broken
			this.players[0].line.origin.at(1),
			this.players[1].line.origin.at(1)
		]
		//FIXME SIZE randomly moves around, size it will always be 1 for now, hardcoded
		retStatus.paddleSize = [
			this.players[0].line.direction.length(),
			this.players[1].line.direction.length(),
			]
//		retStatus.paddleSize = [(this.players[0]).size, (this.players[1]).size]
//		retStatus.paddleSize = this.ball
		retStatus.ball = [this.ball.at(0), this.ball.at(1)]
		retStatus.score = this.score
		return retStatus
	}

	//Defaults
	private readonly width:number = 10
	private readonly height:number = 10
	private readonly winScore:[number, number] = [10, 10]
	private readonly paddleLength = 2;//TODO Maybe one for each player
	private map:LineSegment[]
	//TODO PRIVATEEEEE!
	public players:[Paddle, Paddle]
	private ball:Point
	private ballVector:Vector
	private score:[number, number]

	//TODO private point
	private newBall():void {
		this.ball.values = [this.width / 2, 0]
		//TODO Ball Vector needs refining, maybe use an angle to compute direction
		//Maybe ensure that the vector is of length X, angle changes shouldn't be huge
		if (Math.random() > 0.5)
			this.ballVector.values = [0.5, 1.5]
		else
			this.ballVector.values = [-0.5, 1.5]
	}
}
