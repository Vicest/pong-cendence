<script lang="ts">
	export let id: number | string;

	import { beforeNavigate, goto } from '$app/navigation';
	import { gameInstances } from '../../store/Game';
	import type { GameInstance, Person } from '$lib/types';
	import { userList } from '../../store/User';
	import { PongGame } from '$lib/GameEngine/Games/Pong';
	import { onMount } from 'svelte';
	import { GamesSocket } from '$services/socket';
	import { currentUser } from '../../store/Auth';

	let gameInstance: GameInstance;
	gameInstances.subscribe((instances) => {
		console.log(instances);
		gameInstance = instances.find((instance) => instance.id.toString() === id) as GameInstance;
	});

	let players: Person[] = [];
	userList.subscribe((users) => {
		players = gameInstance.players.map((player) => {
			return users.find((user) => user.id === player) as Person;
		});
	});

	/*beforeNavigate(({ cancel }) => {
		if (
			gameInstance.players.indexOf($currentUser.id) !== -1 &&
			!confirm('Are you sure you want to leave this page? All the progress will be lost.')
		) {
			cancel();
		}
	});*/

	onMount(() => {
		let game = new PongGame(gameInstance.id, players, $currentUser.id);
	});
</script>

<div class="card p-4 h-full">
	<div id="game-{gameInstance.id}" class="game-wrapper flex justify-center items-center h-full" />
</div>

<style lang="postcss">
</style>
