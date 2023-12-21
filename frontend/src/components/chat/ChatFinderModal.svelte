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
	import { joinChannel, notJoinedChannelChat } from '../../store/Chat';

	import type { ChannelsChat, Person } from '$lib/types';
	import { currentUser } from '../../store/Auth';
	import type { SvelteComponent } from 'svelte';
	import ChatAvatar from './ChatAvatar.svelte';
	import { Api } from '$services/api';
	import { currentUserFriends, sendFriendRequest, userList } from '../../store/User';

	function addRelation({
		type,
		selected
	}: {
		type: 'Direct' | 'Channel';
		selected: ChannelsChat | Person;
	}) {
		if (type === 'Direct') {
			sendFriendRequest(selected.id);
		} else {
			joinChannel(selected.id);
		}
	}

	export let parent: SvelteComponent;
	let keyword: string = '';
	$: filteredChannels = $notJoinedChannelChat
		.map((channel, index) => {
			return {
				index,
				...channel,
				user: $currentUser
			};
		})
		.filter((channel) => {
			return (
				(channel.type !== 'Direct' && channel.name.toLowerCase().includes(keyword.toLowerCase())) ||
				channel.description.toLowerCase().includes(keyword.toLowerCase())
			);
		});
	$: filteredUsers = $userList
		.filter((user) => {
			return (
				$currentUserFriends.map((u) => u.id).indexOf(user.id) === -1 &&
				user.id !== $currentUser.id &&
				$userList
					.find((u) => u.id === $currentUser.id)
					?.invitations.map((u) => u.id)
					.indexOf(user.id) === -1
			);
		})
		.filter((user) => {
			return user.nickname.toLowerCase().includes(keyword.toLowerCase());
		});
	let selectedChannel: ChannelsChat;
	let selectedUser: Person;
	let selected: ChannelsChat | Person;
</script>

<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
	<header class="modal-header text-center p-4 border-b border-surface-500/30">
		<h2 class="h2">Start a conversation</h2>
	</header>
	<input class="input" type="search" placeholder="Search..." bind:value={keyword} />
	<p class="text-sm">People</p>
	<ListBox
		class="border border-surface-500 p-4 rounded-container-token overflow-y-auto max-h-[30vh]"
		multiple{false}
		active="variant-filled-primary"
	>
		{#each filteredUsers as user}
			<ListBoxItem
				group={selected}
				on:click={() => {
					selected = user;
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
		{#if filteredUsers.length === 0}
			<div class="flex justify-center items-center">
				<span class="text-gray-400">No results found</span>
			</div>
		{/if}
	</ListBox>
	<p class="text-sm">Channels</p>
	<ListBox
		class="border border-surface-500 p-4 rounded-container-token overflow-y-auto max-h-[30vh]"
		multiple{false}
		active="variant-filled-primary"
	>
		{#each filteredChannels.filter((channel) => channel.type === 'Channel') as channel}
			<ListBoxItem
				group={selected}
				on:click={() => {
					selected = channel;
				}}
				name="people"
				value={channel}
			>
				<div class="flex items-center space-x-4">
					<span>
						{channel.name}
					</span>
				</div>
			</ListBoxItem>
		{/each}
		{#if filteredChannels.length === 0}
			<div class="flex justify-center items-center">
				<span class="text-gray-400">No results found</span>
			</div>
		{/if}
	</ListBox>
	<footer class="modal-footer flex justify-center items-center space-x-4">
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				addRelation({
					type: typeof selected.login !== 'undefined' ? 'Direct' : selected.type,
					selected
				});
				parent.onClose();
			}}
			disabled={!selected}>Send invitation</button
		>
		<button
			class="btn variant-ghost-surface"
			on:click={() => {
				parent.onClose();
			}}>Cancel</button
		>
	</footer>
</div>
