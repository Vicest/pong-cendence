import { QueuePlayerDto } from './dtos';
export declare class MatchMakingService {
    constructor();
    joinQueue(queuedPlayer: QueuePlayerDto): boolean;
    private queuedPlayers;
}
