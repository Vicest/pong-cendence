<script lang="ts">
	import { MatchMakingSocket } from '$services/socket';
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { lastError } from '../store/Common';
	import { matchMakingChallenges } from '../store/Matchmaking';
	import { userList } from '../store/User';
	import { gameList } from '../store/Game';
	const toastStore = getToastStore();

	matchMakingChallenges.subscribe((challenges) => {
		if (challenges.length === 0) return;
		let challenge = challenges[challenges.length - 1];
		let user = $userList.find((user) => user.id === challenge.opponentId);
		let game = $gameList.find((game) => game.id === challenge.gameId);
		if (!user || !game) return;
		toastStore.trigger({
			message: `You've been challenged by ${user.nickname} to play ${game.name}`,
			hideDismiss: true,
			timeout: challenge.timeout,
			action: {
				label: 'Accept',
				response: () => {
					MatchMakingSocket.emit('challengeResponse', {
						gameId: challenge.gameId,
						accept: true,
						opponentId: challenge.opponentId
					});
				}
			}
		});
	});

	lastError.subscribe((message) => {
		if (message) {
			toastStore.trigger({
				message,
				timeout: 1200,
				background: 'variant-filled-error'
			});
		}
		lastError.set(null);
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

<Toast zIndex="z-50" />
