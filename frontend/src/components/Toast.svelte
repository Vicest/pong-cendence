<script lang="ts">
	import { MatchMakingSocket } from '$services/socket';
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { matchMakingChallenges } from '../store/Matchmaking';
	const toastStore = getToastStore();

	matchMakingChallenges.subscribe((challenges) => {
		console.log('challenges', challenges);
		/*if (challenges.length > 0) {
			toastStore.trigger({
				message: `You have ${challenges.length} pending challenges`,
				hideDismiss: true,
				timeout: 15000,
				action: {
					label: 'View',
					response: () => {
						console.log('View challenges');
					}
				}
			});
		}*/
	});

	/*MatchMakingSocket.on('beChallenged', (opponentId, gameId, timeout) => {
		console.log('beChallenged');
		console.log(`I was challenged by: ${opponentId}`);
		toastStore.trigger({
			message: `You've been challenged by ${opponentId}`,
			hideDismiss: true,
			timeout: 15000,
			action: {
				label: 'Accept',
				response: () => {
					MatchMakingSocket.emit('challengeResponse', {
						gameId: gameId,
						accept: true,
						opponentId
					});
				}
			}
		});
	});*/
</script>

<Toast />
