<script lang="ts">
	import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { joinedChannelsChat } from '../../store/Chat';
	import { userList } from '../../store/User';
	import { get } from 'svelte/store';
	import type { ChannelsChat, MessageFeed, Person } from '$lib/types';
	import ChatAvatar from './ChatAvatar.svelte';
	import { ChatSocket } from '$services/socket';
	import { onMount } from 'svelte';
	import ChatSidebar from './ChatSidebar.svelte';
	import ChatHeader from './ChatHeader.svelte';
	import ChatConversation from './ChatConversation.svelte';
	import ChatPrompt from './ChatPrompt.svelte';
	import { currentUser } from '../../store/Auth';

	export let id = -1;
	export let showAllContacts = false;
	export let showSidebar = true;
	export let showHeader = true;
	export let showConversation = true;
	export let showPrompt = true;

	type ChatType = 'friends' | 'channels';

	let currentMessage = '';

	function addMessage() {
		console.log('addMessage', $joinedChannelsChat);
		ChatSocket.emit('channel_message', {
			message: currentMessage,
			channel: $joinedChannelsChat[selectedChatIndex].id
		});
		currentMessage = '';
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			addMessage();
			setTimeout(() => {
				scrollChatBottom('smooth');
			}, 50);
		}
	}
	let selectedChatIndex: number;
	let selectedChatMessages: MessageFeed[] = [];

	let elemChat: HTMLElement;

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}
	let channels: ChannelsChat[];

	$: channels = $joinedChannelsChat
		.filter((channel) => {
			return (id === -1 ? true : channel.id === id) || showAllContacts;
		})
		.map((channel, index) => {
			return channel.type === 'Direct'
				? {
						index,
						...channel,
						type: 'Direct',
						user: channel.users.find((user) => user.id != $currentUser.id) as Person
				  }
				: {
						index,
						...channel,
						user: $currentUser
				  };
		});

	onMount(() => {
		if (id !== -1) {
			selectedChatIndex = channels.findIndex((channel) => channel.id === id) || 0;
		}
		console.log('selectedChatIndex', selectedChatIndex, channels);
	});
</script>

<section class="card w-full h-full">
	{#if showSidebar}
		<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
			<ChatSidebar bind:channels bind:selectedChatIndex />
			{#if channels[selectedChatIndex]}
				<div class="relative h-full grid grid-rows-[auto_1fr_auto]">
					{#if showHeader}
						<ChatHeader channel={channels[selectedChatIndex]} />
					{/if}
					{#if showConversation}
						<ChatConversation bind:elemChat channel={channels[selectedChatIndex]} />
					{/if}
					{#if showPrompt}
						<ChatPrompt bind:elemChat channel={channels[selectedChatIndex]} />
					{/if}
				</div>
			{:else}
				<div class="flex items-center justify-center h-full">
					<span class="text-2xl">Please select a chat</span>
				</div>
			{/if}
		</div>
	{:else}
		<div class="relative h-full grid grid-rows-[auto_1fr_auto]">
			{#if channels[selectedChatIndex]}
				{#if showHeader}
					<ChatHeader channel={channels[selectedChatIndex]} />
				{/if}
				{#if showConversation}
					<ChatConversation bind:elemChat channel={channels[selectedChatIndex]} />
				{/if}
				{#if showPrompt}
					<ChatPrompt bind:elemChat channel={channels[selectedChatIndex]} />
				{/if}
			{:else}
				<div class="flex items-center justify-center h-full">
					<span class="text-2xl text-surface-500">Select a chat</span>
				</div>
			{/if}
		</div>
	{/if}
</section>
