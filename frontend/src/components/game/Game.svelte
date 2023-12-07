<script lang="ts">
	export let id: number | string;

	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { gameInstances } from '../../store/Game';
	import type { GameInstance, Person } from '$lib/types';
	import { userList } from '../../store/User';
	import { currentUser } from '../../store/Auth';

	let gameInstance: GameInstance;
	gameInstances.subscribe((instances) => {
		gameInstance = instances.find((instance) => instance.id.toString() === id);
	});

	let players: Person[] = [];
	userList.subscribe((users) => {
		players = gameInstance.players.map((player) => {
			return users.find((user) => user.id === player);
		});
	});

	beforeNavigate(({ cancel }) => {
		if (
			gameInstance.players.indexOf($currentUser.id) !== -1 &&
			!confirm('Are you sure you want to leave this page? All the progress will be lost.')
		) {
			cancel();
		}
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="card p-4">
		<h2 class="h2">Arena {gameInstance.game}</h2>
		<h2 class="h2">Arena {players.length}</h2>
		{#each players as player}
			<div class="flex items-center space-x-4">
				<span>{player.nickname}</span>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
</style>
