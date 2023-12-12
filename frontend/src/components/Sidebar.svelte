<script lang="ts">
	import {
		AppRail,
		AppRailAnchor,
		AppRailTile,
		Avatar,
		LightSwitch,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import { faMoon, faSignOut } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Cookies from 'js-cookie';
	import { goto } from '$app/navigation';
	import SidebarMatch from './game/SidebarMatch.svelte';
	import { gameInstances, gameListDrawerSettings } from '../store/Game';
	const drawerStore = getDrawerStore();

	$: activeMatches = $gameInstances.filter((game) =>
		['waiting', 'running', 'paused'].includes(game.status)
	);

	let arenaTile: number = 0;
	const logOut = () => {
		Cookies.remove('token');
		Cookies.remove('refreshToken');
		goto('/login');
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
		{:else}
			<AppRailAnchor
				on:click={() => drawerStore.open($gameListDrawerSettings)}
				class="cursor-pointer"
			>
				<div class="flex flex-col items-center space-y-6 w-full h-full">
					<Fa icon={faMoon} size="1.5x" />
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
