<script lang="ts">
	import { PongGame } from '$lib/GameEngine/Games/Pong';
	import { userList } from '../../store/User';
	import { gameInstances } from '../../store/Game';
	import { get } from 'svelte/store';
	import { currentUser } from '../../store/Auth';
	import { onDestroy, tick } from 'svelte';

	export let id: number | string;
	let game: PongGame;
	let loading = true;

	$: updateGame(id);

	async function updateGame(id: number | string) {
		if (typeof game !== 'undefined') {
			loading = true;
			game.destroy();
		}
		let gameInstance = get(gameInstances).find((instance) => instance.id === id);
		if (typeof gameInstance !== 'undefined') {
			let players = $userList
				.filter((user) => gameInstance?.players.includes(user.id))
				.sort((a, b) => {
					if (gameInstance?.players.indexOf(a.id) < gameInstance?.players.indexOf(b.id)) {
						return -1;
					} else {
						return 1;
					}
				});
			loading = false;
			await tick();
			game = new PongGame(gameInstance, players, get(currentUser).id);
		}
	}

	onDestroy(() => {
		if (typeof game !== 'undefined') game.destroy();
	});
</script>

<div class="card p-4 h-full">
	{#if loading}
		<div class="flex justify-center items-center h-screen animate-pulse">
			<a href="/" aria-label="Home">
				<img src="/images/logo.png" alt="logo" class="h-20" />
			</a>
		</div>
	{/if}
	<div id="game-{id}" class="game-wrapper flex justify-center items-center h-full" />
</div>

<style lang="postcss">
</style>
