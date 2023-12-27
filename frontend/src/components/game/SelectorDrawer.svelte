<script lang="ts">
	import { getDrawerStore, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { gameList, gameListDrawerSettings } from '../../store/Game';
	import { selectedGame } from '../../store/Common';
	import { Api } from '$services/api';
	import { currentUser } from '../../store/Auth';
	import { get } from 'svelte/store';
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
	let targetSelectorModal: ModalSettings = {
		type: 'component',
		component: 'targetSelectorModal'
	};

	//currentUser
	////If the user closes the Modal, front forgets about the state, but back retains it.
	//let playerInQueue = false;
	//
	//function queueToggle() {
	//	if (!playerInQueue) {
	//		Api.post('/matchmaking/queue');
	//	} else {
	//		Api.delete('/matchmaking/queue');
	//	}
	//	playerInQueue = !playerInQueue;
	//}
	$: inQueue = get(currentUser).inQueue;
	currentUser.subscribe((user) => {
		console.log('Queue value: ', user);
		inQueue = user.inQueue;
	});
</script>

<div class="flex flex-col gap-6 items-around h-full overflow-y-auto">
	<div
		class="text-center border-b border-gray-200 border-opacity-50 sticky py-4 top-0 z-10 backdrop-blur transition-colors duration-500 bg-surface-500/30"
	>
		<h2 class="h2">Game list</h2>
	</div>
	{#if inQueue}
		<button
			on:click={async () => {
				await Api.delete('/matchmaking/queue');
				currentUser.update((person) => {
					person.inQueue = false;
					return person;
				});
				console.log('qweqwe  ', get(currentUser).inQueue);
			}}>Leave queue</button
		>
	{:else}
		<button
			on:click={async () => {
				await Api.post('/matchmaking/queue');
				currentUser.update((person) => {
					person.inQueue = true;
					return person;
				});
			}}>Join queue</button
		>
	{/if}
	{#each $gameList as game}
		<button
			class="card {!game.enabled ? 'opacity-50 cursor-not-allowed' : ''} bg-surface-500/30"
			on:click={() => {
				if (!game.enabled) return false;
				drawerStore.close();
				selectedGame.set(game);
				modalStore.trigger(targetSelectorModal);
				//goto('/app/arena');
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
