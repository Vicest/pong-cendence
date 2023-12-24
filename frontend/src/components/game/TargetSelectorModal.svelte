<script lang="ts">
	import {
		Avatar,
		ListBox,
		ListBoxItem,
		SlideToggle,
		getDrawerStore,
		Toast,
		getToastStore
	} from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	import { userList } from '../../store/User';
	import type { Person } from '$lib/types';
	import { currentUser } from '../../store/Auth';
	import type { SvelteComponent } from 'svelte';
	import { selectedGame } from '../../store/Common';
	import { goto } from '$app/navigation';
	import ChatAvatar from '../chat/ChatAvatar.svelte';
	import { GamesSocket, MatchMakingSocket } from '$services/socket';

	let toastStore = getToastStore();

	function sendChallenge(targetId: number) {
		MatchMakingSocket.emit('challenge', {
			opponentId: targetId,
			gameId: $selectedGame?.id
		});
		toastStore.trigger({
			message: `You challenged ${selectedUser.nickname}`
		});
	}

	export let parent: SvelteComponent;
	let keyword: string = '';
	$: people = $userList.filter(
		(person: any) =>
			person.nickname.toLowerCase().includes(keyword.toLowerCase()) &&
			person.id !== $currentUser.id &&
			person.status === 'online'
	);
	let selectedUser: Person;
</script>

<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
	<header class="modal-header text-center p-4 border-b border-surface-500/30">
		<h2 class="h2">Select target for game "{$selectedGame?.name}"</h2>
	</header>
	{#if people.length > 0}
		<input class="input" type="search" placeholder="Search..." bind:value={keyword} />
	{/if}

	<ListBox
		class="border border-surface-500 p-4 rounded-container-token overflow-y-auto max-h-[30vh]"
		multiple{false}
		active="variant-filled-primary"
	>
		{#each people as user}
			<ListBoxItem
				group={selectedUser}
				on:click={() => {
					selectedUser = user;
				}}
				name="people"
				value={user}
			>
				<div class="flex items-center space-x-4">
					<ChatAvatar {user} width="w-10" />
					<span>
						{user.nickname}
					</span>
				</div>
			</ListBoxItem>
		{/each}
		{#if people.length === 0}
			<div class="flex justify-center items-center">
				<span class="text-gray-400">No users found</span>
			</div>
		{/if}
	</ListBox>
	<!-- prettier-ignore -->
	<footer class="modal-footer flex justify-center items-center space-x-4">
		<button class="btn variant-filled-primary"on:click={() => {
			sendChallenge(selectedUser.id);
			console.log(`I challenged: ${selectedUser.login}`);
			//goto(`/app/arena/1`)
			parent.onClose()
		}} disabled={!selectedUser}>Send invitation</button>
		<button class="btn variant-ghost-surface" on:click={() => {
			//drawerStore.open($gameListDrawerSettings);
			parent.onClose()
		}}>Cancel</button>
    </footer>
</div>
