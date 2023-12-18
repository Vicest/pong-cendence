<script lang="ts">
	import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	// Global stores
	import type { Channel } from '$lib/types';
	import { chat_receptor, chat_history } from '../../store/Chat';
	import { joined_channels } from '../../store/Chat';
	// Components
	import Group_Channel_Chat from './Group_Channel_Chat.svelte';
	import Group_Channel_User_List from './Group_Channel_User_List.svelte';

	let channels: Channel[] = [];
	let displayChat = false;
	let displayUserList = false;
	let chatText = '';

	joined_channels.subscribe((value) => {
		channels = [...value];
	});

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		// scrollChatBottom();
		channels = [...$joined_channels];
	});

	function filterChannel(keyword: string): void {
		displayChat = false;
		if (!keyword) {
			channels = [...$joined_channels];
		} else {
			channels = $joined_channels.filter((channel: Channel) => {
				return channel.nickname.toLowerCase().includes(keyword.toLowerCase());
			});
		}
	}

	function avatarClick(channel: Channel) {
		displayUserList = false;
		displayChat = true;
		// console.log('channel activated -> ', channel);
		chat_receptor.set(channel);
		chat_history.set([]);
		chat_history.set($chat_receptor.messages);
		console.log('channel activated -> ', $chat_history);
	}

	function userListClick(channel: Channel) {
		chat_receptor.set(channel);
		displayUserList = true;
		displayChat = false;
	}
</script>

<div class="border-b border-surface-500/30 p-4">
	<button
		class="btn variant-ghost-surface"
		on:click={() => {
			chatText = 'Canales Buscados';
		}}>Buscar canales</button
	>
	<button
		class="btn variant-ghost-surface"
		on:click={() => {
			chatText = 'Añadir canales';
		}}>+</button
	>
</div>
<div class="card chat-card wrapper">
	<div class="list_channel">
		<div class="border-b border-surface-500/30 p-4">
			<input
				class="input"
				type="search"
				placeholder="Search..."
				on:input={(e) => filterChannel(e.target.value)}
			/>
		</div>

		<div class="user-list-container p-4 space-y-4 overflow-y-auto">
			{#each channels as channel}
				<div class="list-item">
					<ListBoxItem
						bind:group={$chat_receptor}
						on:click={() => {
							avatarClick(channel);
						}}
						name="people"
						value={channel}
					>
						{channel.nickname}
					</ListBoxItem>
					<button
						class="btn variant-ghost-surface"
						on:click={() => {
							userListClick(channel);
						}}
						>User List
					</button>
				</div>
			{/each}
		</div>
	</div>
	{#if displayChat}
		<Group_Channel_Chat />
	{/if}
	{#if displayUserList}
		<Group_Channel_User_List />
	{/if}
</div>

<style>
	/* @import './chat.css'; */
	.chat-card {
		/* z-index: 4; */
		position: fixed;
		height: 100vh;
		width: 94vw;
	}

	.wrapper {
		display: grid;
		/* grid-template-columns: repeat(3, 1fr); */
		grid-template-columns: 30% 60% auto;
		grid-template-areas:
			'a b b'
			'a b b';
	}

	.list_channel {
		grid-area: a;
		border-right: 1px solid rgba(151, 151, 151, 0.2);
		/* background-color: red; */
	}

	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
