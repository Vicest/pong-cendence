<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile, Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import { faMoon, faSignOut } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Cookies from 'js-cookie';
	import { goto } from '$app/navigation';
	import SidebarMatch from './game/SidebarMatch.svelte';
	import { gameInstances } from '../store/Game';

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
		{#each $gameInstances as game, i}
			<AppRailAnchor href={`/app/arena/${game.id}`} current={arenaTile === i}>
				<div class="flex flex-col items-center space-y-4">
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
