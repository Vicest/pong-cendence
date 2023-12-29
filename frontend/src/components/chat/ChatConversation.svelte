<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import ChatAvatar from './ChatAvatar.svelte';
	import { currentUser } from '../../store/Auth';
	import { userList } from '../../store/User';
	import { channelList } from '../../store/Chat';

	export let channel: ChannelsChat;
	export let elemChat: HTMLElement;

	let formatDate = (date: string): string => {
		let d = new Date(date);
		return d.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	};
</script>

<!-- Coversation -->
<section
	class="relative p-4 overflow-y-auto space-y-4 max-h-[1100px] {userList.blockedMe(
		channel.user.id
	) ||
	userList.blockedByMe(channel.user.id) ||
	(channel.type === 'Direct' && !userList.areFriends(channel.user.id)) ||
	(channel.type === 'Channel' && channelList.isBanned(channel.id, $currentUser.id)) ||
	(channel.type === 'Channel' && channelList.isMuted(channel.id, $currentUser.id))
		? 'opacity-30 cursor-not-allowed'
		: ''}"
	bind:this={elemChat}
>
	{#each channel?.messages || [] as message}
		{#if message.sender.id === $currentUser.id}
			<div class="grid grid-cols-[1fr_auto] gap-2">
				<div class="card p-4 variant-soft rounded-tr-none space-y-2">
					<header class="flex justify-between items-center">
						<p class="font-bold">{message.sender.nickname}</p>
						<small class="opacity-50">{formatDate(message.created_at)}</small>
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
						<small class="opacity-50">{formatDate(message.created_at)}</small>
					</header>
					<p>{message.content}</p>
				</div>
			</div>
		{/if}
	{/each}
	{#if channel.type === 'Direct' && !userList.areFriends(channel.user.id)}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="card p-4 space-y-2">
				<h1 class="text-center">You are not in the user's friend list</h1>
				{#if !userList.invitedByMe(channel.user.id)}
					<p class="text-center">You can send a friend request to this user in the user profile</p>
				{/if}
			</div>
		</div>
	{:else if channel.type === 'Direct' && (userList.blockedMe(channel.user.id) || userList.blockedByMe(channel.user.id))}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="card p-4 space-y-2">
				<h1 class="text-center">
					{userList.blockedByMe(channel.user.id)
						? 'You have blocked this user'
						: 'You have been blocked by this user'}
				</h1>
				<p class="text-center">
					{userList.blockedByMe(channel.user.id)
						? 'You can unblock this user in the user profile'
						: `You can't send messages to this user until he unblocks you`}
				</p>
			</div>
		</div>
	{:else if channel.type === 'Channel' && channelList.isBanned(channel.id, $currentUser.id)}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="card p-4 space-y-2">
				<h1 class="text-center">You have been banned from this channel</h1>
				<p class="text-center">You can't send messages to this channel until you are unbanned</p>
			</div>
		</div>
	{:else if channel.type === 'Channel' && channelList.isMuted(channel.id, $currentUser.id)}
		<div class="absolute inset-0 flex justify-center items-center">
			<div class="card p-4 space-y-2">
				<h1 class="text-center">You have been muted in this channel</h1>
				<p class="text-center">You can't send messages to this channel until you are unmuted</p>
				<p class="text-center">
					Wait {channelList.getMuteTime(channel.id, $currentUser.id)} seconds
				</p>
			</div>
		</div>
	{/if}
</section>
