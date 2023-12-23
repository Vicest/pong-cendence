<script lang="ts">
	export let id: number;
	import { gameInstances } from '../../store/Game';
	import type { GameInstance, Person } from '$lib/types';
	import { userList } from '../../store/User';
	import { Avatar } from '@skeletonlabs/skeleton';

	let gameInstance: GameInstance;
	gameInstances.subscribe((instances) => {
		gameInstance = instances.find((instance) => {
			return instance.id == id;
		}) as GameInstance;
	});

	let players: Person[] = [];
	userList.subscribe((users) => {
		players = gameInstance?.players.map((player) => {
			return users.find((user) => user.id === player) as Person;
		});
	});
</script>

<div>
	{#if players.length > 0}
		<h4>{gameInstance?.id}</h4>
		<hr class="border-surface-500/30 my-4" />
		<div class="avatar-group">
			{#each players as player}
				<div class="avatar-group-item">
					<Avatar src={player.avatar} alt={player.nickname} />
					<small>{player.nickname}</small>
				</div>
			{/each}
		</div>
		<small class="mt-4">{gameInstance?.status}</small>
	{/if}
</div>
