<script lang="ts">
	import { MatchMakingSocket } from '$services/socket';
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import { lastError } from '../store/Common';
	const toastStore = getToastStore();

	MatchMakingSocket.on('beChallenged', (opponentId) => {
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
						accept: true,
						opponentId
					});
				}
			}
		});
	});

	lastError.subscribe((message) => {
		if (message)
		{
			toastStore.trigger({
				message,
				timeout: 1200,
				background: 'variant-filled-error'
			})
		}
		lastError.set(null)
	});

</script>

<Toast />
