<script lang="ts">
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import {
		chat_history,
		chat_receptor,
		joined_channels,
		receptor,
		unjoined_channels
	} from '../../store/Chat';
	import ChatAvatar from '../ChatInvididual/ChatAvatar.svelte';
	import RelationPanel from '../friend/RelationPanel.svelte';
	import { currentUser } from '../../store/Auth';
	import { onMount } from 'svelte';
	import LeaveButton from './UserList/LeaveButton.svelte';
	import { Api } from '$services/api';
	import KickButton from './UserList/KickButton.svelte';
	import PromoteButton from './UserList/PromoteButton.svelte';

	let selectedPerson: any;
	onMount(async () => {
		console.log('Chat receptor -> ', $chat_receptor);
	});

	function selectPerson(person: any): void {
		console.log('Wololo -> ', person);
		receptor.set(person);
		selectedPerson = person;
	}
</script>

<div class="div_area wrapper">
	<div class="perfil_area flex items-center space-x-6">
		<div class="title-container" style="font-size: 22px">
			{$chat_receptor.nickname}
		</div>
		<LeaveButton />
	</div>

	<div class="chat_area max-h-[400px] p-4 overflow-y-auto space-y-4">
		<div style="font-size: 18px">
			<ListBox active="variant-filled-primary">
				{#each $chat_receptor.members as person}
					<div>
						<ListBoxItem
							bind:group={$chat_receptor.members}
							on:click={() => {
								selectPerson(person);
							}}
							name="people"
							value={person}
						>
							<ChatAvatar showStatus={false} user={person} width="w-12" />
							<div>{person.nickname}</div>
							<div>{person.channel_status}</div>
							{#if $receptor == person && receptor.id != $currentUser.id}
								<!-- <RelationPanel /> -->
								<KickButton />
								<PromoteButton />
							{/if}
						</ListBoxItem>
					</div>
				{/each}
			</ListBox>
		</div>
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-rows: 10% 60% auto;
		grid-template-areas:
			'c c c'
			'd d d'
			'e e e';
		/* background-color: aqua; */
	}

	.div_area {
		grid-area: b;
		/* background-color: black; */
	}

	.perfil_area {
		grid-area: c;
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(151, 151, 151, 0.2);
		/* background-color: rgb(29, 150, 33); */
	}
	.chat_area {
		grid-area: d;
		/* background-color: rgb(28, 57, 173); */
	}
	.send_msg_area {
		grid-area: e;
		/* background-color: rgb(192, 152, 23); */
	}

	.title-container {
		margin-left: 10px; /* Ajusta el margen izquierdo según sea necesario */
	}
</style>
