<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import ChatAvatar from './ChatAvatar.svelte';
	import Accept from './buttons/Accept.svelte';
	import Block from './buttons/Block.svelte';
	import Cancel from './buttons/Cancel.svelte';
	import Invite from './buttons/Invite.svelte';
	import Remove from './buttons/Remove.svelte';
	import Unblock from './buttons/Unblock.svelte';
	import Join from './buttons/Join.svelte';
	import Leave from './buttons/Leave.svelte';
	import Delete from './buttons/Delete.svelte';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ChannelDetailsModal from './ChannelDetailsModal.svelte';
	export let channel: ChannelsChat;

	const modalStore = getModalStore();
	let channelDetailsModal: ModalSettings = {
		type: 'component',
		component: 'channelDetailsModal',
		meta: {
			id: channel.id
		}
	};
</script>

<!-- Header -->
{#if channel.type === 'Direct'}
	<header class="border-b border-surface-500/50 p-4">
		<div class="grid grid-cols-[auto_1fr_auto] gap-2">
			<ChatAvatar user={channel.user} width="w-8" showStatus={false} />
			<div class="space-y-2">
				<p class="font-bold">
					{channel.user.nickname}
				</p>
				<small class="opacity-50">{channel.user.status}</small>
			</div>
			<div class="flex justify-end items-center space-x-2">
				<Accept bind:user={channel.user} />
				<Block bind:user={channel.user} />
				<Cancel bind:user={channel.user} />
				<Invite bind:user={channel.user} />
				<Unblock bind:user={channel.user} />
				<Remove bind:user={channel.user} />
			</div>
		</div>
	</header>
{:else if channel.type === 'Channel'}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<header
		class="border-b border-surface-500/50 p-4 hover:bg-surface-500/10 hover:cursor-pointer transition"
	>
		<div class="grid grid-cols-[1fr_auto] gap-2">
			<div
				class="space-y-2"
				on:click={() => {
					channelDetailsModal.meta = { id: channel.id };
					modalStore.trigger(channelDetailsModal);
				}}
				aria-hidden="true"
			>
				<small class="flex items-center space-x-2">
					<p class="font-bold">
						{channel.name}
					</p>
					<div class="opacity-50 flex items-center space-x-1">
						<p>
							{channel.users.length}
						</p>
						<Fa icon={faUser} size="xs" />
					</div>
				</small>
				<small class="opacity-50">{channel.description}</small>
			</div>
			<div class="flex justify-end items-center space-x-2">
				<Join bind:channel />
				<Leave bind:channel />
				<Delete bind:channel />
			</div>
		</div>
	</header>
{/if}
