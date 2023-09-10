import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OngoingGamesService } from './ongoing-games.service';
import { Socket } from 'socket.io';
export declare class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private ogs;
    private server;
    private logger;
    private matchString;
    private sessions;
    constructor(ogs: OngoingGamesService);
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): void;
    onChallenge(socket: Socket, opponentUUID: string): void;
    onChallengeResponse(socket: Socket, response: {
        accept: boolean;
        opponent: string;
    }): void;
    onPlayerMoves(data: {
        player: string;
        match: string;
        actions: number;
    }): void;
    opponentAvailable(userId: string): boolean;
}
