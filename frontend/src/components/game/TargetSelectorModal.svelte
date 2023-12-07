<script lang="ts">
	import { Avatar, ListBox, ListBoxItem, getDrawerStore } from '@skeletonlabs/skeleton';
	import { userList } from '../../store/User';
	import type { Person } from '$lib/types';
	import { currentUser } from '../../store/Auth';
	import type { SvelteComponent } from 'svelte';
	import { gameListDrawerSettings, selectedGame } from '../../store/Game/GameList';
	import { goto } from '$app/navigation';

	const drawerStore = getDrawerStore();

	export let parent: SvelteComponent;
	let people = $userList;
	let selectedUser: Person;
	const filterUsers = (keyword: string): void => {
		people = $userList
			.filter((person: any) => {
				return person.nickname.toLowerCase().includes(keyword.toLowerCase());
			})
			.filter((person: any) => {
				return person.id !== $currentUser.id;
			});
	};
	filterUsers('');
</script>

<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
	<header class="modal-header text-center p-4 border-b border-surface-500/30">
		<h2 class="h2">Select target for game "{$selectedGame?.name}"</h2>
	</header>
	<input
		class="input"
		type="search"
		placeholder="Search..."
		on:input={(e) => filterUsers(e.target.value)}
	/>

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
					<Avatar src={user.avatar} width="w-12" />
					<span>
						{user.nickname}
					</span>
				</div>
			</ListBoxItem>
		{/each}
	</ListBox>
	<!-- prettier-ignore -->
	<footer class="modal-footer flex justify-center items-center space-x-4">
		<button class="btn variant-filled-primary"on:click={() => {
			goto('/app/arena');
			parent.onClose()
		}} disabled={!selectedUser}>Send invitation</button>
		<button class="btn variant-ghost-surface" on:click={() => {
			//drawerStore.open($gameListDrawerSettings);
			parent.onClose()
		}}>Cancel</button>
    </footer>
</div>
