<script lang="ts">
	import { page } from '$app/stores';
	import Game from '../../../../../components/game/Game.svelte';
</script>

<div class="h-full grid gap-4 p-4 lg:grid-cols-[4fr,1fr] lg:grid-rows-[1fr] grid-rows-[2fr,1fr]">
	<Game id={parseInt($page.params.id)} />
</div>

<style lang="postcss">
</style>
