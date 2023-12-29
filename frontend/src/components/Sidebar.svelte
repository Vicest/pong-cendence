<script lang="ts">
	import { AppRail, AppRailAnchor, LightSwitch, getDrawerStore } from '@skeletonlabs/skeleton';
	import { faSignOut } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { goto } from '$app/navigation';
	import SidebarMatch from './game/SidebarMatch.svelte';
	import { gameInstances } from '../store/Game';
	import { Api } from '$services/api';
	import {
		ChatSocket,
		GamesSocket,
		MatchMakingSocket,
		Socket,
		UsersSocket
	} from '$services/socket';
	const drawerStore = getDrawerStore();

	$: activeMatches = $gameInstances.filter((game) =>
		['waiting', 'running', 'paused'].includes(game.status)
	);

	let arenaTile: number = 0;
	const logOut = () => {
		Api.post('/auth/logout').then(() => {
			[Socket, UsersSocket, GamesSocket, MatchMakingSocket, ChatSocket].forEach((s) => {
				s.disconnect();
			});
			goto('/');
		});
	};
</script>

<!-- App Rail -->
<AppRail class="lg:grid hidden">
	<svelte:fragment slot="lead">
		{#each activeMatches as game, i}
			<AppRailAnchor href={`/app/arena/${game.id}`} current={arenaTile === i}>
				<div class="flex flex-col items-center space-y-6">
					<SidebarMatch id={game.id} />
				</div>
			</AppRailAnchor>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<AppRailAnchor class="cursor-pointer">
			<div class="flex flex-col items-center space-y-4">
				<LightSwitch />
			</div>
		</AppRailAnchor>
		<AppRailAnchor class="cursor-pointer" title="Account" on:click={logOut}>
			<div class="flex flex-col items-center space-y-4">
				<Fa icon={faSignOut} size="1.5x" />
			</div>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
