<script lang="ts">
	import { getDrawerStore, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { gameList, gameListDrawerSettings } from '../../store/Game';
	import { selectedGame } from '../../store/Common';
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	let targetSelectorModal: ModalSettings = {
		type: 'component',
		component: 'targetSelectorModal'
	};
</script>

<div class="flex flex-col gap-6 items-around h-full overflow-y-auto">
	<div
		class="text-center border-b border-gray-200 border-opacity-50 sticky py-4 top-0 z-10 backdrop-blur transition-colors duration-500 bg-surface-500/30"
	>
		<h2 class="h2">Game list</h2>
	</div>
	{#each $gameList as game}
		<button
			class="card {!game.enabled ? 'opacity-50 cursor-not-allowed' : ''} bg-surface-500/30"
			on:click={() => {
				if (!game.enabled) return false;
				drawerStore.close();
				selectedGame.set(game);
				modalStore.trigger(targetSelectorModal);
			}}
		>
			<header class="relative">
				<img
					src={game.image}
					class="bg-black/50 w-full aspect-[21/9] object-cover object-center"
					alt="cover"
				/>
				<h6 class="absolute top-0 left-0 p-4 font-bold" data-toc-ignore>
					{game.title}
				</h6>
			</header>
			<div class="p-4 space-y-4">
				<h3 class="h3" data-toc-ignore>{game.title}</h3>
				<article>
					<p data-toc-ignore>
						{game.description}
					</p>
				</article>
			</div>
			<hr class="opacity-50" />
			<footer class="p-4 flex justify-start items-center space-x-4">
				<div class="flex-auto flex justify-between items-center">
					<h6 class="font-bold" data-toc-ignore>By: {game.creator}</h6>
					<small>On {game.launched_at.toLocaleDateString()}</small>
				</div>
			</footer>
		</button>
	{/each}
</div>
