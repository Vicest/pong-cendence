import { Server } from 'socket.io';
export declare class OngoingGamesService {
    constructor();
    newMatch(matchKey: string, players: [string, string]): void;
    update(gateway: Server, matchKey: string, player: string, actions: number): void;
    tick(gateway: Server): void;
    private logger;
    private games;
}
