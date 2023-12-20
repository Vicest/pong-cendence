<script lang="ts">
	import { page } from '$app/stores';
	import Chat from '../../../../../components/chat/Chat.svelte';
	import Game from '../../../../../components/game/Game.svelte';
</script>

<div class="h-full grid gap-4 p-4 lg:grid-cols-[4fr,1fr] lg:grid-rows-[1fr] grid-rows-[2fr,1fr]">
	<Game id={parseInt($page.params.id)} />
	<div class="card p-4 h-full">
		<h2 class="h2">Chat</h2>
		<Chat id={3} showSidebar={false} showHeader={false} />
	</div>
</div>

<style lang="postcss">
</style>
