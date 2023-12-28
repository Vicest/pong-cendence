import { goto } from '$app/navigation';
import { MatchMakingSocket } from '$services/socket';
import { get, writable } from 'svelte/store';
import { currentUser } from './Auth';

export const matchMakingChallenges = writable<
	{
		gameId: number;
		opponentId: number;
		timeout: number;
	}[]
>([]);

export const init = () => {
	MatchMakingSocket.connect();

	MatchMakingSocket.on('beChallenged', (challengeInfo) => {
		matchMakingChallenges.update((challenges) => {
			return challenges.concat(challengeInfo);
		});
	});

	MatchMakingSocket.on('challengeDeleted', (removeId) => {
		matchMakingChallenges.update((challenges) => {
			return challenges
				.map((challenge) => `${challenge.opponentId}-${get(currentUser).id}-${challenge.gameId}`)
				.filter((id) => id !== removeId);
		});
	});

	MatchMakingSocket.on('challengeAccepted', (matchId) => {
		matchMakingChallenges.set([]);
		goto(`/app/arena/${matchId}`);
	});
};
