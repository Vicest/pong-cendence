<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import { faLock, faSquarePlus, faUser } from '@fortawesome/free-solid-svg-icons';
	import { ListBox, ListBoxItem, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ChatAvatar from './ChatAvatar.svelte';
	import { userList } from '../../store/User';
	import { goto } from '$app/navigation';
	import Fa from 'svelte-fa';
	const modalStore = getModalStore();
	let chatFinderModal: ModalSettings = {
		type: 'component',
		component: 'chatFinderModal'
	};
	let chatCreatorModal: ModalSettings = {
		type: 'component',
		component: 'chatCreatorModal'
	};
	$: findUser = (id: number) => {
		return $userList.find((user) => user.id === id) as Person;
	};

	export let channels: ChannelsChat[];
	export let selectedChatIndex: number;
</script>

<!-- Navigation -->
<div class="lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
	<!-- Header -->
	<header class="border-b border-surface-500/30 p-4">
		<input
			class="input"
			type="search"
			placeholder="Search..."
			on:click={() => modalStore.trigger(chatFinderModal)}
		/>
	</header>
	<!-- List -->
	<div class="p-4 space-y-4 overflow-y-auto">
		<!-- Contacts -->
		<small class="opacity-50">Contacts</small>
		{#if channels.filter((c) => c.type === 'Direct').length === 0}
			<span class="badge block variant-filled"
				>No contacts, please add some friends in the above search bar.</span
			>
		{/if}
		<ListBox active="variant-filled-primary">
			{#each channels.filter((c) => c.type === 'Direct') as channel}
				<ListBoxItem
					bind:group={channels[selectedChatIndex]}
					on:click={() => {
						console.log('click', channel);
						selectedChatIndex = channel.index;
					}}
					name="people"
					value={channel}
					class={selectedChatIndex === channel.index ? 'variant-filled-primary' : ''}
					on:click={() => {
						goto(`/app/chat/${channel.id}`);
					}}
				>
					<svelte:fragment slot="lead">
						<ChatAvatar user={findUser(channel.user.id)} width="w-8" showStatus={false} />
					</svelte:fragment>
					{findUser(channel.user.id).nickname}
				</ListBoxItem>
			{/each}
		</ListBox>
		<small class="opacity-50">Channels</small>
		{#each channels.filter((c) => c.type === 'Channel') as channel}
			<ListBox active="variant-filled-primary">
				<ListBoxItem
					bind:group={channels[selectedChatIndex]}
					on:click={() => {
						console.log('click', channel);
						selectedChatIndex = channel.index;
					}}
					name="people"
					value={channel}
					class={selectedChatIndex === channel.index ? 'variant-filled-primary' : ''}
					on:click={() => {
						goto(`/app/chat/${channel.id}`);
					}}
				>
					<div class="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
						{channel.name}
						{#if channel.users.length > 0}
							<div class="opacity-50 flex items-center space-x-1">
								<p>{channel.users.length}</p>
								<Fa icon={faUser} size="xs" />
							</div>
						{/if}
						{#if channel.hasPassword}
							<Fa icon={faLock} size="xs" class="text-surface-500/50" />
						{/if}
					</div>
				</ListBoxItem>
			</ListBox>
		{/each}
	</div>
	<!-- Footer -->
	<footer class="border-t border-surface-500/30 p-4">
		<div class="flex justify-center items-center space-x-4">
			<button
				type="button"
				class="btn w-full variant-filled-surface"
				on:click={() => modalStore.trigger(chatCreatorModal)}
			>
				<span><Fa icon={faSquarePlus} class="text-2xl" /></span>
				<span>Create new channel</span>
			</button>
		</div>
	</footer>
</div>
