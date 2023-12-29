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
	import Play from './buttons/Play.svelte';
	import { faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import ChannelDetailsModal from './ChannelDetailsModal.svelte';
	import { goto } from '$app/navigation';
	import { userList } from '../../store/User';
	export let channel: ChannelsChat;
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

	$: findUser = (id: number) => {
		return $userList.find((user) => user.id === id) as Person;
	};

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
		<div class="grid grid-cols-[1fr_auto] gap-2">
			<div
				class="flex items-center space-x-2 hover:cursor-pointer transition"
				on:click={() => {
					goto(`/app/profile/${channel.user.id}`);
				}}
				aria-hidden="true"
			>
				<ChatAvatar user={findUser(channel.user.id)} width="w-8" showStatus={false} />
				<div class="space-y-2">
					<p class="font-bold">
						{findUser(channel.user.id).nickname}
					</p>
					<small class="opacity-50">{findUser(channel.user.id).status}</small>
				</div>
			</div>
			<div class="flex justify-end items-center space-x-2">
				<Play bind:user={channel.user} />
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
		<div class="grid grid-cols-[1fr_auto] items-center gap-2">
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
				<Leave bind:channel />
				<Delete bind:channel />
			</div>
		</div>
	</header>
{/if}
