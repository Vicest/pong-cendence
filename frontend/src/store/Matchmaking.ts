import { MatchMakingSocket } from '$services/socket';
import { getToastStore } from '@skeletonlabs/skeleton';

export const init = () => {
	console.log('Matchmaking init');
	MatchMakingSocket.connect();
};
