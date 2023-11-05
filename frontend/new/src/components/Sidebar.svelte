<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	import Fa from 'svelte-fa';
	import { faGamepad, faUserFriends } from '@fortawesome/free-solid-svg-icons';

	let arenaTile: number = 0;
	let friendsTile: number = 0;

	/** @type {import('./$types').PageData}*/
	export let data: any;
</script>

<!-- App Rail -->
<AppRail>
	<svelte:fragment slot="lead">
		{#await data.streammed.matches}
			<div class="flex flex-col items-center space-y-4 mb-4">
				<div class="placeholder-circle w-16 animate-pulse" />
			</div>
		{:then matches}
			{#each matches as match, i}
				<AppRailAnchor href={`/arena/${match.id}`} current={arenaTile === i}>
					<div class="flex flex-col items-center space-y-4">
						<div class="placeholder-circle w-16" />
					</div>
				</AppRailAnchor>
			{/each}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</svelte:fragment>
</AppRail>
