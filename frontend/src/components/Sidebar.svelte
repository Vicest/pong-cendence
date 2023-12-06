<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile, Avatar } from '@skeletonlabs/skeleton';
	import { matchList } from '../store/Match';

	let arenaTile: number = 0;
</script>

<!-- App Rail -->
<AppRail class="lg:block hidden">
	<svelte:fragment slot="lead">
		{#each $matchList as match, i}
			<AppRailAnchor href={`/app/arena/${match.id}`} current={arenaTile === i}>
				<div class="flex flex-col items-center space-y-4">
					<Avatar initials={match.score.join('')} width="w-10" />
				</div>
			</AppRailAnchor>
		{/each}
	</svelte:fragment>
</AppRail>
