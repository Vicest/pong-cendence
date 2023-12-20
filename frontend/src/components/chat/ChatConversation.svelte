<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import ChatAvatar from './ChatAvatar.svelte';
	import { currentUser } from '../../store/Auth';
	import { userList } from '../../store/User';

	$: findSender = (id: number) => {
		return $userList.find((user) => user.id === id) as Person;
	};

	export let channel: ChannelsChat;
	export let elemChat: HTMLElement;
</script>

<!-- Coversation -->
<section class="p-4 overflow-y-auto space-y-4 max-h-[1100px]" bind:this={elemChat}>
	{#each channel?.messages || [] as message}
		{#if message.sender.id === $currentUser.id}
			<div class="grid grid-cols-[1fr_auto] gap-2">
				<div class="card p-4 variant-soft rounded-tr-none space-y-2">
					<header class="flex justify-between items-center">
						<p class="font-bold">{findSender(message.sender.id).nickname}</p>
						<small class="opacity-50">{message.created_at}</small>
					</header>
					<p>{message.content}</p>
				</div>
				<ChatAvatar user={findSender(message.sender.id)} width="w-8" showStatus={false} />
			</div>
		{:else}
			<div class="grid grid-cols-[auto_1fr] gap-2">
				<ChatAvatar user={findSender(message.sender.id)} width="w-8" showStatus={false} />
				<div class="card p-4 rounded-tl-none space-y-2">
					<header class="flex justify-between items-center">
						<p class="font-bold">{findSender(message.sender.id).nickname}</p>
						<small class="opacity-50">{message.created_at}</small>
					</header>
					<p>{message.content}</p>
				</div>
			</div>
		{/if}
	{/each}
</section>
