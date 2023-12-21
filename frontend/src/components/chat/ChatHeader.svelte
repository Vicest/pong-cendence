<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import ChatAvatar from './ChatAvatar.svelte';
	import {
		blockUser,
		unblockUser,
		userList,
		sendFriendRequest,
		cancelFriendRequest,
		acceptUser,
		rejectUser,
		currentUserFriends,
		removeFriend
	} from '../../store/User';
	import { currentUser } from '../../store/Auth';

	let findUser: (id: number) => Person;
	let blockedByMe: (id: number) => boolean;
	let blockedMe: (id: number) => boolean;
	let invitedByMe: (id: number) => boolean;
	let invitedMe: (id: number) => boolean;
	let areFriends: (id: number) => boolean;

	$: {
		findUser = (id: number) => {
			return $userList.find((user) => user.id === id) as Person;
		};

		invitedByMe = (id: number) => {
			return (
				$userList
					.find((user) => user.id === $currentUser.id)
					?.invitations.some((user) => user.id === id) ?? false
			);
		};

		invitedMe = (id: number) => {
			return (
				$userList
					.find((user) => user.id === id)
					?.invitations.some((user) => user.id === $currentUser.id) ?? false
			);
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

		areFriends = (id: number) => {
			return (
				$userList
					.find((user) => user.id === $currentUser.id)
					?.friends.some((user) => user.id === id) ?? false
			);
		};
	}

	export let channel: ChannelsChat;
</script>

<!-- Header -->
{#if channel.type === 'Direct'}
	<header class="border-b border-surface-500/50 p-4">
		<div class="grid grid-cols-[auto_1fr_auto] gap-2">
			<ChatAvatar user={findUser(channel.user.id)} width="w-8" showStatus={false} />
			<div class="space-y-2">
				<p class="font-bold">
					{findUser(channel.user.id).nickname}
				</p>
				<small class="opacity-50">{findUser(channel.user.id).status}</small>
			</div>
			<div class="flex justify-end items-center space-x-2">
				{#if areFriends(channel.user.id)}
					{#if blockedByMe(channel.user.id)}
						<button
							type="button"
							class="btn variant-filled-primary"
							on:click={() => {
								unblockUser(channel.user.id);
							}}>Unblock</button
						>
					{:else}
						<button
							type="button"
							class="btn variant-filled-error"
							on:click={() => {
								blockUser(channel.user.id);
							}}>Block</button
						>
						<button
							type="button"
							class="btn variant-filled-error"
							on:click={() => {
								removeFriend(channel.user.id);
							}}>Remove</button
						>
					{/if}
				{:else if invitedByMe(channel.user.id)}
					<button
						type="button"
						class="btn variant-filled-primary"
						on:click={() => {
							cancelFriendRequest(channel.user.id);
						}}>Cancel out</button
					>
				{:else if invitedMe(channel.user.id)}
					<button
						type="button"
						class="btn variant-filled-primary"
						on:click={() => {
							acceptUser(channel.user.id);
						}}>Accept</button
					>
				{:else if !invitedByMe(channel.user.id) && !areFriends(channel.user.id)}
					<button
						type="button"
						class="btn variant-filled-primary"
						on:click={() => {
							sendFriendRequest(channel.user.id);
						}}>Invite</button
					>
				{/if}
			</div>
		</div>
	</header>
{/if}
