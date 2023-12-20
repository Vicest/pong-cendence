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
			return id === -1 ? true : channel.id === id;
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
		selectedChatIndex = id !== -1 ? channels.findIndex((channel) => channel.id === id) || 0 : 0;
		console.log('selectedChatIndex', selectedChatIndex, channels);
		setTimeout(() => {
			scrollChatBottom('instant');
		}, 1);
	});
</script>

{#if showSidebar}{/if}

<section class="card w-full h-full">
	{#if channels[selectedChatIndex]}
		{#if showSidebar}
			<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
				<ChatSidebar bind:channels bind:selectedChatIndex />
				<div class="h-full grid grid-rows-[auto_1fr_auto]">
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
			</div>
		{:else}
			<div class="h-full grid grid-rows-[auto_1fr_auto]">
				{#if showHeader}
					<ChatHeader channel={channels[selectedChatIndex]} />
				{/if}
				{#if showConversation}
					<ChatConversation bind:elemChat bind:channel={channels[selectedChatIndex]} />
				{/if}
				{#if showPrompt}
					<ChatPrompt bind:elemChat bind:channel={channels[selectedChatIndex]} />
				{/if}
			</div>
		{/if}
	{/if}
</section>
