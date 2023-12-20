<script lang="ts">
	import type { ChannelsChat } from '$lib/types';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import ChatAvatar from './ChatAvatar.svelte';
	import { userList } from '../../store/User';

	$: findUser = (id: number) => {
		return $userList.find((user) => user.id === id) as Person;
	};

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
				<button type="button" class="btn variant-filled-error">Block</button>
			</div>
		</div>
	</header>
{/if}
