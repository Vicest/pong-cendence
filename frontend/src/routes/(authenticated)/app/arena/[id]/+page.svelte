<script lang="ts">
	import { page } from '$app/stores';
	import Chat from '../../../../../components/chat/Chat.svelte';
	import Game from '../../../../../components/game/Game.svelte';
	import { gameInstances } from '../../../../../store/Game';

	let game = $gameInstances.find((g) => g.id === parseInt($page.params.id));
</script>

<div class="h-full grid gap-4 p-4 lg:grid-cols-[4fr,1fr] lg:grid-rows-[1fr] grid-rows-[2fr,1fr]">
	<Game id={parseInt($page.params.id)} />
	<div class="card p-4 h-full">
		<h2 class="h2">Chat</h2>
		{#if game}
			<!-- <Chat id={game.channel?.id} showSidebar={false} showHeader={false} /> -->
		{/if}
	</div>
</div>

<style lang="postcss">
</style>
