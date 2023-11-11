<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile, Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { matchList, updateScore } from '../../../../../store/Match';

	import Fa from 'svelte-fa';
	import { faGamepad, faUserFriends } from '@fortawesome/free-solid-svg-icons';

	let arenaTile: number = 0;
	let friendsTile: number = 0;

	/** @type {import('./$types').PageData}*/
	export let data: any;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Arena {$page.params.slug}</h2>

		<input
			class="input"
			type="number"
			title="Team 1 score"
			placeholder="Team 1 score"
			bind:value={$matchList[$page.params.slug].score[0]}
		/><br />
		<input
			class="input"
			type="text"
			title="Team 1 score"
			placeholder="Team 2 score"
			bind:value={$matchList[$page.params.slug].score[1]}
		/>
	</div>
</div>

<style lang="postcss">
</style>
