import { goto } from '$app/navigation';
import { MatchMakingSocket } from '$services/socket';
import { writable } from 'svelte/store';

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
			return challenges.filter((id) => id !== removeId);
		});
	});

	MatchMakingSocket.on('challengeAccepted', (matchId) => {
		matchMakingChallenges.update((challenges) => {
			return challenges.filter((id) => id !== matchId);
		});
		goto(`/app/arena/${matchId}`);
	});
};
