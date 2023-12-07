<script lang="ts">
	import { page } from '$app/stores';
	import Game from '../../../../../components/game/Game.svelte';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<Game id={$page.params.slug} />
</div>

<style lang="postcss">
</style>
