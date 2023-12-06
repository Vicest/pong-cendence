<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile, Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import { matchList } from '../store/Match';
	import { faMoon, faSignOut } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Cookies from 'js-cookie';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

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
		{#each $matchList as match, i}
			<AppRailAnchor href={`/app/arena/${match.id}`} current={arenaTile === i}>
				<div class="flex flex-col items-center space-y-4">
					<Avatar initials={match.score.join('')} width="w-10" />
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
		<AppRailAnchor class="cursor-pointer" title="Account"  on:click={logOut}>
			<div class="flex flex-col items-center space-y-4">
				<Fa icon={faSignOut} size="1.5x" />
			</div>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
