<script lang="ts">
	import {
		Avatar,
		ListBox,
		ListBoxItem,
		SlideToggle,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import { userList } from '../../store/User';
	import type { Person } from '$lib/types';
	import { currentUser } from '../../store/Auth';
	import type { SvelteComponent } from 'svelte';
	import { selectedGame } from '../../store/Common';
	import { goto } from '$app/navigation';
	import ChatAvatar from '../chat/ChatAvatar.svelte';
	import { Api } from '$services/api';

	const drawerStore = getDrawerStore();
	//TODO I don't really know how to handle this.
	//If the user closes the Modal, front forgets about the state, but back retains it.
	let playerInQueue = false;

	function queueToggle() {
		if (!playerInQueue) {
			Api.post('/games/queue');
		} else {
			Api.delete('/games/queue');
		}
		playerInQueue = !playerInQueue;
	}

	export let parent: SvelteComponent;
	let keyword: string = '';
	$: people = $userList.filter(
		(person: any) =>
			person.nickname.toLowerCase().includes(keyword.toLowerCase()) && person.id !== $currentUser.id
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
		<SlideToggle name="slider-label" on:click={() => queueToggle()}>Queueing  </SlideToggle>
		<button class="btn variant-filled-primary"on:click={() => {
			goto(`/app/arena/1`)
			parent.onClose()
		}} disabled={!selectedUser}>Send invitation</button>
		<button class="btn variant-ghost-surface" on:click={() => {
			//drawerStore.open($gameListDrawerSettings);
			parent.onClose()
		}}>Cancel</button>
    </footer>
</div>
