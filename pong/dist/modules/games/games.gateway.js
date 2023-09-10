"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const ongoing_games_service_1 = require("./ongoing-games.service");
const socket_io_1 = require("socket.io");
let GamesGateway = class GamesGateway {
    constructor(ogs) {
        this.ogs = ogs;
        this.sessions = new Set();
        this.logger = new common_1.Logger('Games Gateway');
        setInterval(() => {
            this.ogs.tick(this.server);
        }, 250);
        this.logger.log('Games Gateway initialized');
    }
    handleConnection(socket) {
        this.logger.debug('Socket connected: ' + socket.id + ' is ' + socket.handshake.auth.token);
        this.sessions.add(socket.handshake.auth.token);
        socket.join(socket.handshake.auth.token);
    }
    handleDisconnect(socket) {
        this.logger.debug('Socket disconnected: ' + socket.id + ' was ' + socket.handshake.auth.token);
    }
    onChallenge(socket, opponentUUID) {
        const challengerUUID = socket.handshake.auth.token;
        this.logger.verbose(opponentUUID + ' challenges ' + challengerUUID);
        if (challengerUUID == opponentUUID) {
            this.logger.warn(challengerUUID + ' challenges self. That would be overly suicidal');
            return;
        }
        this.logger.verbose(opponentUUID + 'joins ' + opponentUUID + 'challengers');
        socket.join(opponentUUID + 'challengers');
        this.logger.verbose(opponentUUID + ' sends beChallenged ' + challengerUUID);
        this.server.to(opponentUUID).emit('beChallenged', challengerUUID);
    }
    onChallengeResponse(socket, response) {
        const challengerUUID = socket.handshake.auth.token;
        const opponentUUID = response.opponent;
        this.logger.verbose(challengerUUID + ' got response from ' + opponentUUID + ': ' + response.accept);
        this.server.in(opponentUUID).socketsLeave(challengerUUID + 'challengers');
        if (response.accept) {
            const roomId = opponentUUID + challengerUUID + 'match';
            this.server.to(opponentUUID).socketsJoin(roomId);
            this.server.to(challengerUUID).socketsJoin(roomId);
            this.logger.verbose('Games gateway sends roomId: ' + roomId);
            this.server.to(roomId).emit('roomId', roomId);
            this.ogs.newMatch(roomId, [challengerUUID, opponentUUID]);
            this.logger.log('Started match: ' + roomId);
        }
    }
    onPlayerMoves(data) {
        this.logger.log("Bored, got player input: " + data.player);
        this.ogs.update(this.server, data.match, data.player, data.actions);
    }
    opponentAvailable(userId) {
        return true;
    }
};
exports.GamesGateway = GamesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GamesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('challenge'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "onChallenge", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('challengeResponse'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "onChallengeResponse", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playerMoves'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GamesGateway.prototype, "onPlayerMoves", null);
exports.GamesGateway = GamesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [ongoing_games_service_1.OngoingGamesService])
], GamesGateway);
//# sourceMappingURL=games.gateway.js.map