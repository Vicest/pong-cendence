<script>
	import { beforeNavigate, goto } from '$app/navigation';
	import { selectedGame } from '../../../../store/Common';

	if ($selectedGame === null) {
		goto('/app');
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="card p-4">
		<h2 class="h2">Arena {$selectedGame?.name}</h2>
	</div>
</div>

<style lang="postcss">
</style>
