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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OngoingGamesService = void 0;
const common_1 = require("@nestjs/common");
const match_1 = require("./classes/match/match");
let OngoingGamesService = class OngoingGamesService {
    constructor() {
        this.games = new Map();
        this.logger = new common_1.Logger('Ongoing Games');
        this.logger.log('Ongoing Games initialized');
    }
    newMatch(matchKey, players) {
        this.games.set(matchKey, new match_1.Match(players));
    }
    update(gateway, matchKey, player, actions) {
        let match = this.games.get(matchKey);
        if (match === undefined) {
            this.logger.warn(`Game update: game ${matchKey} does not exist`);
            return;
        }
        else if (!match.playing(player)) {
            this.logger.warn(`Game update: player ${player} not in game ${matchKey}`);
            return;
        }
        if (actions == 0)
            match.playerInput(player, 0.5);
        else if (actions == 1)
            match.playerInput(player, -0.5);
        else
            this.logger.warn(`Invalid action '${actions}' in ${matchKey} by ${player}`);
        this.games.forEach((match, key) => {
            gateway.to(key).emit('gameUpdate', match.status());
        });
    }
    tick(gateway) {
        this.games.forEach((match, key) => {
            let updateEvent = match.gameTick();
            gateway.to(key).emit('gameUpdate', match.status());
            {
                let winner;
                let loser;
                switch (updateEvent) {
                    default: {
                        this.logger.warn(`Unhandled match ${key} event '${updateEvent}'`);
                        return;
                    }
                    case 0:
                        return;
                    case -1: {
                        winner = match.players[0].id;
                        loser = match.players[1].id;
                        break;
                    }
                    case -2: {
                        loser = match.players[0].id;
                        winner = match.players[1].id;
                        break;
                    }
                }
                gateway.to(winner).emit('win');
                gateway.to(loser).emit('lose');
                gateway.to(key).socketsLeave(key);
                this.games.delete(key);
            }
        });
    }
};
exports.OngoingGamesService = OngoingGamesService;
exports.OngoingGamesService = OngoingGamesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OngoingGamesService);
//# sourceMappingURL=ongoing-games.service.js.map