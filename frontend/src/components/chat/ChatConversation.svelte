<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import ChatAvatar from './ChatAvatar.svelte';
	import { currentUser } from '../../store/Auth';
	import { currentUserFriends, userList } from '../../store/User';

	let findSender: (id: number) => Person;

	let blockedByMe: (id: number) => boolean;
	let blockedMe: (id: number) => boolean;
	let isBlocked: (id: number) => boolean;
	let requestedFriendByMe: (id: number) => boolean;
	let requestedFriend: (id: number) => boolean;
	let areFriends: (id: number) => boolean;

	$: {
		findSender = (id: number) => {
			return $userList.find((user) => user.id === id) as Person;
		};
		blockedByMe = (id: number) => {
			return (
				$userList
					.find((user) => user.id === $currentUser.id)
					?.blocked.some((user) => user.id === id) ?? false
			);
		};

		blockedMe = (id: number) => {
			return (
				$userList
					.find((user) => user.id === id)
					?.blocked.some((user) => user.id === $currentUser.id) ?? false
			);
		};

		isBlocked = (id: number) => {
			return blockedByMe(id) || blockedMe(id);
		};

		requestedFriendByMe = (id: number) => {
			return (
				$userList
					.find((user) => user.id === $currentUser.id)
					?.invitations.some((user) => user.id === id) ?? false
			);
		};

		requestedFriend = (id: number) => {
			return (
				$userList
					.find((user) => user.id === id)
					?.invitations.some((user) => user.id === $currentUser.id) ?? false
			);
		};

		areFriends = (id: number) => {
			return channel.type === 'Channel' || $currentUserFriends.map((u) => u.id).indexOf(id) !== -1;
		};
	}

	export let channel: ChannelsChat;
	export let elemChat: HTMLElement;
</script>

<!-- Coversation -->
<section
	class="relative p-4 overflow-y-auto space-y-4 max-h-[1100px] {isBlocked(channel.user.id) ||
	!areFriends(channel.user.id)
		? 'opacity-30 cursor-not-allowed'
		: ''}"
	bind:this={elemChat}
>
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
	{#if !areFriends(channel.user.id)}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="card p-4 space-y-2">
				<h1 class="text-center">You are not in the user's friend list</h1>
				<p class="text-center">You can send a friend request to this user in the user profile</p>
			</div>
		</div>
	{:else if isBlocked(channel.user.id)}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="card p-4 space-y-2">
				<h1 class="text-center">
					{blockedByMe(channel.user.id)
						? 'You have blocked this user'
						: 'You have been blocked by this user'}
				</h1>
				<p class="text-center">
					{blockedByMe(channel.user.id)
						? 'You can unblock this user in the user profile'
						: `You can't send messages to this user until he unblocks you`}
				</p>
			</div>
		</div>
	{/if}
</section>
