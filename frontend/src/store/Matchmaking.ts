import { MatchMakingSocket } from '$services/socket';
import { getToastStore } from '@skeletonlabs/skeleton';
import { writable } from 'svelte/store';

export const matchMakingChallenges = writable<number[]>([]);

export const init = () => {
	MatchMakingSocket.connect();

	MatchMakingSocket.on('beChallenged', (challengerId) => {
		matchMakingChallenges.update((challenges) => {
			return challenges.concat(challengerId);
		});
	});

	MatchMakingSocket.on('challengeDeleted', (id) => {
		matchMakingChallenges.update((challenges) => {
			return challenges.filter((id) => id !== id);
		});
	});
};
