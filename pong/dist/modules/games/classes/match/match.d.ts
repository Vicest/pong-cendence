import { Vector } from 'ts-matrix';
type Point = Vector;
declare class LineSegment {
    constructor(origin: Point, end: Point, end_is_vector: boolean);
    get origin(): Vector;
    get direction(): Vector;
    get length(): number;
    set origin(origin: Point);
    intersection(origin: Point, direction: Vector): {
        inSegment: boolean;
        coords: Vector;
    };
    reflect(incidencePoint: Point, source: Point): Point;
    private origin_;
    private direction_;
    private solveQuadratic;
    private reflectPoint;
}
export declare class matchStatus {
    paddlePosition: [number, number];
    paddleSize: [number, number];
    ball: [number, number];
    score: [number, number];
}
declare class Paddle {
    constructor(player: string, corner: Point, length: number);
    get id(): string;
    get line(): LineSegment;
    get momentum(): number;
    move(distance: number): void;
    clearMomentum(): void;
    private readonly id_;
    private line_;
    private momentum_;
    private readonly moveRangeMax_;
    private moveRangePosition_;
}
export declare class Match {
    constructor(players: [string, string], targetScore?: [number, number]);
    playerInput(player: string, distance: number): void;
    playing(user: string): boolean;
    gameTick(): number;
    status(): matchStatus;
    private readonly width;
    private readonly height;
    private readonly winScore;
    private readonly paddleLength;
    private map;
    players: [Paddle, Paddle];
    private ball;
    private ballVector;
    private score;
    private newBall;
}
export {};
