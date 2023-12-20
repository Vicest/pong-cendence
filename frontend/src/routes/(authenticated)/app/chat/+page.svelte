<script lang="ts">
	import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { channelsChat } from '../../../../store/Chat';
	import { userList } from '../../../../store/User';
	import { get } from 'svelte/store';
	import type { ChannelsChat, MessageFeed, Person } from '$lib/types';
	import { currentUser } from '../../../../store/Auth';
	import ChatAvatar from '../../../../components/chat/ChatAvatar.svelte';
	import { ChatSocket } from '$services/socket';
	import { onMount } from 'svelte';

	type ChatType = 'friends' | 'channels';

	let currentMessage = '';

	function addMessage() {
		console.log('addMessage', $channelsChat);
		ChatSocket.emit('channel_message', {
			message: currentMessage,
			channel: $channelsChat[selectedChatIndex].id
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

	onMount(() => {
		selectedChatIndex = 0;
		setTimeout(() => {
			scrollChatBottom('instant');
		}, 1);
	});
</script>

<section class="card w-full h-full">
	<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
			<!-- Header -->
			<header class="border-b border-surface-500/30 p-4">
				<input class="input" type="search" placeholder="Search..." />
			</header>
			<!-- List -->
			<div class="p-4 space-y-4 overflow-y-auto">
				<!-- Contacts -->
				<small class="opacity-50">Contacts</small>
				{#each $channelsChat.filter((c) => c.type === 'Direct') as channel}
					<ListBoxItem
						on:click={() => {
							selectedChatIndex = $channelsChat.findIndex((c) => c.id === channel.id);
						}}
						group="channels"
						name="people"
						value={channel}
						class={channel.id === $channelsChat[selectedChatIndex]?.id
							? 'variant-filled-primary'
							: ''}
					>
						{$channelsChat[selectedChatIndex]?.users?.find((u) => u.id != $currentUser.id)
							?.nickname}
					</ListBoxItem>
				{/each}
				<small class="opacity-50">Channels</small>

				{#each $channelsChat.filter((c) => c.type === 'Channel') as channel, i}
					<ListBoxItem
						on:click={() => {
							selectedChatIndex = $channelsChat.findIndex((c) => c.id === channel.id);
						}}
						group="channels"
						name="people"
						value={channel}
						class={channel.id === $channelsChat[selectedChatIndex]?.id
							? 'variant-filled-primary'
							: ''}
					>
						{channel.name}
					</ListBoxItem>
				{/each}
			</div>
		</div>
		<!-- Chat -->
		<div class="h-full grid grid-rows-[auto_1fr_auto]">
			<!-- Header -->
			{#if $channelsChat[selectedChatIndex]?.type === 'Direct'}
				<header class="border-b border-surface-500/50 p-4">
					<div class="grid grid-cols-[auto_1fr_auto] gap-2">
						<ChatAvatar
							user={$channelsChat[selectedChatIndex]?.users?.find((u) => u.id != $currentUser.id)}
							width="w-8"
							showStatus={false}
						/>
						<div class="space-y-2">
							<p class="font-bold">
								{$channelsChat[selectedChatIndex]?.users?.find((u) => u.id != $currentUser.id)
									?.nickname}
							</p>
							<small class="opacity-50"
								>{$channelsChat[selectedChatIndex]?.users?.find((u) => u.id != $currentUser.id)
									?.status}</small
							>
						</div>
						<div class="flex justify-end items-center space-x-2">
							<button type="button" class="btn variant-filled-error">Block</button>
						</div>
					</div>
				</header>
			{/if}
			<!-- Conversation -->
			<section bind:this={elemChat} class="p-4 overflow-y-auto space-y-4 max-h-[1150px]">
				{#each $channelsChat[selectedChatIndex]?.messages || [] as message}
					{#if message.sender.id === $currentUser.id}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card p-4 variant-soft rounded-tr-none space-y-2">
								<header class="flex justify-between items-center">
									<p class="font-bold">{message.sender.nickname}</p>
									<small class="opacity-50">{message.created_at}</small>
								</header>
								<p>{message.content}</p>
							</div>
							<ChatAvatar user={message.sender} width="w-8" showStatus={false} />
						</div>
					{:else}
						<div class="grid grid-cols-[auto_1fr] gap-2">
							<ChatAvatar user={message.sender} width="w-8" showStatus={false} />
							<div class="card p-4 rounded-tl-none space-y-2">
								<header class="flex justify-between items-center">
									<p class="font-bold">{message.sender.nickname}</p>
									<small class="opacity-50">{message.created_at}</small>
								</header>
								<p>{message.content}</p>
							</div>
						</div>
					{/if}
				{/each}
			</section>
			<!-- Prompt -->
			<section class="p-4 overflow-y-auto space-y-4 max-h-[1150px]">
				<div
					class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
				>
					<button class="input-group-shim">+</button>
					<textarea
						bind:value={currentMessage}
						class="bg-transparent border-0 ring-0"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
						on:keydown={onPromptKeydown}
					/>
					<button
						class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
						on:click={addMessage}
					>
						<i class="fa-solid fa-paper-plane" />
					</button>
				</div>
			</section>
		</div>
	</div>
</section>
