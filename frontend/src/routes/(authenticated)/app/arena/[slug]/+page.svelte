<script lang="ts">
	import { page } from '$app/stores';
	import Game from '../../../../../components/game/Game.svelte';
	import Direct_Channel_Chat from '../../../../../components/chat/Direct_Channel_Chat.svelte';
</script>

<div class="h-full grid gap-4 p-4 lg:grid-cols-[4fr,1fr] lg:grid-rows-[1fr] grid-rows-[2fr,1fr]">
	<Game id={$page.params.slug} />
	<div class="card p-4 h-full">
		<h2 class="h2">Chat</h2>
	</div>
</div>

<style lang="postcss">
</style>
