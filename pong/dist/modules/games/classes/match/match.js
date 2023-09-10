"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.matchStatus = void 0;
const ts_matrix_1 = require("ts-matrix");
function inRange(value, rangeBegin, rangeEnd) {
    return value >= rangeBegin && value <= rangeEnd;
}
class LineSegment {
    constructor(origin, end, end_is_vector) {
        this.origin_ = new ts_matrix_1.Vector(origin.values);
        this.direction_ = new ts_matrix_1.Vector(end.values);
        if (!end_is_vector)
            this.direction_ = this.direction_.substract(origin);
    }
    get origin() {
        return this.origin_;
    }
    get direction() {
        return this.direction_;
    }
    get length() {
        return this.direction_.length();
    }
    set origin(origin) {
        this.origin_ = origin;
    }
    intersection(origin, direction) {
        const collision = new ts_matrix_1.Vector(this.solveQuadratic(origin, direction));
        return {
            inSegment: (inRange(collision.substract(origin).length(), 0, direction.length())
                && collision.substract(origin).dot(direction) > 0
                && inRange(collision.substract(this.origin).length(), 0, this.direction.length())
                && collision.substract(this.origin).dot(this.direction) > 0),
            coords: collision,
        };
    }
    reflect(incidencePoint, source) {
        let reflectedPoint = new ts_matrix_1.Vector(source.values).substract(incidencePoint);
        const perpendicular = new ts_matrix_1.Vector([
            this.direction.at(1),
            -this.direction.at(0),
        ]);
        let reflMatrix = new ts_matrix_1.Matrix(2, 2);
        if (perpendicular.at(0) == 0) {
            reflMatrix.values = [
                [-1, 0],
                [0, 1],
            ];
        }
        else {
            const slope = Math.tan(perpendicular.at(1) / perpendicular.at(0));
            const commonFactor = 1 / (1 + Math.pow(slope, 2));
            reflMatrix.values = [
                [commonFactor * (1 - Math.pow(slope, 2)), commonFactor * 2 * slope],
                [commonFactor * 2 * slope, commonFactor * (Math.pow(slope, 2) - 1)],
            ];
        }
        const reflectedPointAsMatrix = reflMatrix.multiply(new ts_matrix_1.Matrix(2, 1, [[reflectedPoint.at(0)], [reflectedPoint.at(1)]]));
        reflectedPoint.values = [
            reflectedPointAsMatrix.at(0, 0),
            reflectedPointAsMatrix.at(1, 0),
        ];
        reflectedPoint = reflectedPoint.add(incidencePoint);
        return reflectedPoint;
    }
    solveQuadratic(origin, direction) {
        const xColumn = new ts_matrix_1.Vector([direction.at(1), this.direction.at(1)]);
        const yColumn = new ts_matrix_1.Vector([-direction.at(0), -this.direction.at(0)]);
        const constantTermColumn = new ts_matrix_1.Vector([
            direction.at(1) * origin.at(0) - direction.at(0) * origin.at(1),
            this.direction.at(1) * this.origin.at(0) - this.direction.at(0) * this.origin.at(1),
        ]);
        let temporaryMatrixName = new ts_matrix_1.Matrix(2, 2, [xColumn.values, yColumn.values]);
        const divisor = temporaryMatrixName.determinant();
        if (divisor == 0)
            throw new Error('Solve Q for paralell lines.');
        temporaryMatrixName.values = [constantTermColumn.values, yColumn.values];
        const xCollision = temporaryMatrixName.determinant() / divisor;
        temporaryMatrixName.values = [xColumn.values, constantTermColumn.values];
        const yCollision = temporaryMatrixName.determinant() / divisor;
        return [xCollision, yCollision];
    }
    reflectPoint(point) {
        let slope = Math.tan(this.direction.at(1) / this.direction.at(0));
        let commonFactor = 1 / (1 + Math.pow(slope, 2));
        let reflMatrix = new ts_matrix_1.Matrix(2, 2, [
            [commonFactor * (1 - Math.pow(slope, 2)), commonFactor * 2 * slope],
            [commonFactor * 2 * slope, commonFactor * (Math.pow(slope, 2) - 1)],
        ]);
        let refectedPointAsMatrix = reflMatrix.multiply(new ts_matrix_1.Matrix(2, 1, [[point.at(0)], [point.at(1)]]));
        return new ts_matrix_1.Vector([refectedPointAsMatrix.at(0, 0), refectedPointAsMatrix.at(0, 1)]);
    }
}
class matchStatus {
}
exports.matchStatus = matchStatus;
class Paddle {
    constructor(player, corner, length) {
        this.id_ = player;
        this.line_ = new LineSegment(corner, new ts_matrix_1.Vector([0, length]), true);
        this.momentum_ = 0;
        this.moveRangeMax_ = 10;
        this.moveRangePosition_ = (this.moveRangeMax_ + this.line_.length) / 2;
    }
    get id() {
        return this.id_;
    }
    get line() {
        return this.line_;
    }
    get momentum() {
        return this.momentum_;
    }
    move(distance) {
        let moveDistance = distance;
        if (moveDistance + this.moveRangePosition_ < 0)
            moveDistance = -this.moveRangePosition_;
        else if (moveDistance + this.moveRangePosition_ + this.line_.length > this.moveRangeMax_)
            moveDistance = this.moveRangeMax_ - this.line_.length - this.moveRangePosition_;
        let moveVector = new ts_matrix_1.Vector(this.line_.direction.values);
        moveVector = moveVector.scale(moveDistance);
        this.line_.origin = this.line_.origin.add(moveVector);
    }
    clearMomentum() {
        this.momentum_ = 0;
    }
}
class Match {
    constructor(players, targetScore = [5, 5]) {
        this.width = 10;
        this.height = 10;
        this.winScore = [10, 10];
        this.paddleLength = 2;
        this.width = 10;
        this.height = 10;
        this.paddleLength = 2;
        this.winScore = targetScore;
        const startHeight = (this.height - this.paddleLength) / 2;
        this.players = [
            new Paddle(players[0], new ts_matrix_1.Vector([0, startHeight]), this.paddleLength),
            new Paddle(players[1], new ts_matrix_1.Vector([this.width, startHeight]), this.paddleLength)
        ];
        this.map = [
            new LineSegment(new ts_matrix_1.Vector([0, 0]), new ts_matrix_1.Vector([this.width, 0]), false),
            new LineSegment(new ts_matrix_1.Vector([0, this.height]), new ts_matrix_1.Vector([this.width, this.height]), false),
        ];
        this.score = [0, 0];
        this.ball = new ts_matrix_1.Vector([0, 0]);
        this.ballVector = new ts_matrix_1.Vector([0, 0]);
        this.newBall();
    }
    playerInput(player, distance) {
        if (this.players[0].id == player)
            this.players[0].move(distance);
        else if (this.players[1].id == player)
            this.players[1].move(distance);
        else
            console.log("Ah, player interaction! *hides in a corner*");
    }
    playing(user) {
        return this.players[0].id == user || this.players[1].id == user;
    }
    gameTick() {
        let chivato = false;
        for (let wall of this.map) {
            const lineIntersection = wall.intersection(this.ball, this.ballVector);
            if (lineIntersection.inSegment) {
                const reflected = wall.reflect(lineIntersection.coords, this.ball);
                const displacementToCollision = lineIntersection.coords.substract(this.ball).length();
                const displacementAfterCollision = this.ballVector.length() - displacementToCollision;
                const ballSpeed = this.ballVector.length();
                this.ball = this.ball.add(this.ballVector.normalize().scale(displacementToCollision));
                this.ballVector = reflected.substract(lineIntersection.coords);
                this.ballVector = this.ballVector.normalize().scale(displacementAfterCollision);
                this.ball = this.ball.add(this.ballVector);
                this.ballVector = reflected.substract(lineIntersection.coords);
                this.ballVector = this.ballVector.normalize().scale(ballSpeed);
                chivato = true;
                break;
            }
        }
        if (!chivato) {
            for (let paddle of [this.players[0].line, this.players[1].line]) {
                const lineIntersection = paddle.intersection(this.ball, this.ballVector);
                if (lineIntersection.inSegment) {
                    const reflected = paddle.reflect(lineIntersection.coords, this.ball);
                    const displacementToCollision = lineIntersection.coords.substract(this.ball).length();
                    const displacementAfterCollision = this.ballVector.length() - displacementToCollision;
                    const ballSpeed = this.ballVector.length();
                    this.ball = this.ball.add(this.ballVector.normalize().scale(displacementToCollision));
                    this.ballVector = reflected.substract(lineIntersection.coords);
                    this.ballVector = this.ballVector.normalize().scale(displacementAfterCollision);
                    this.ball = this.ball.add(this.ballVector);
                    this.ballVector = reflected.substract(lineIntersection.coords);
                    this.ballVector = this.ballVector.normalize().scale(ballSpeed);
                    chivato = true;
                }
            }
        }
        if (!chivato)
            this.ball.values = this.ball.add(this.ballVector).values;
        if (this.ball.at(0) < 0) {
            this.score[1] += 1;
            if (this.score[1] == this.winScore[1]) {
                return -2;
            }
            else {
                this.newBall();
                return 0;
            }
        }
        else if (this.ball.at(0) > this.width) {
            this.score[0] += 1;
            if (this.score[0] == this.winScore[0]) {
                return -1;
            }
            else {
                this.newBall();
                return 0;
            }
        }
        this.players[0].clearMomentum();
        this.players[1].clearMomentum();
        return 0;
    }
    status() {
        let retStatus = new matchStatus;
        retStatus.paddlePosition = [
            this.players[0].line.origin.at(1),
            this.players[1].line.origin.at(1)
        ];
        retStatus.paddleSize = [
            this.players[0].line.direction.length(),
            this.players[1].line.direction.length(),
        ];
        retStatus.ball = [this.ball.at(0), this.ball.at(1)];
        retStatus.score = this.score;
        return retStatus;
    }
    newBall() {
        this.ball.values = [this.width / 2, 0];
        if (Math.random() > 0.5)
            this.ballVector.values = [0.5, 1.5];
        else
            this.ballVector.values = [-0.5, 1.5];
    }
}
exports.Match = Match;
//# sourceMappingURL=match.js.map