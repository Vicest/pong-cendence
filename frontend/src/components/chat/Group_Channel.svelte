<script lang="ts">
	import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	// Global stores
	import type { Group } from '$lib/types';
	import { receptor , chat_history } from "../../store/Chat";
	import { mock_channels , mock_priv_msg } from "../../store/Chat"
	// Components
	import GroupChannelChat from './Group_Channel_Chat.svelte';
	import GroupChannelUserList from './Group_Channel_User_List.svelte';

	let people : Group[] = [];

	let currentPerson : any;
	let displayChat = false;
	let displayUserList = false;

	let aux_receptor: any;
	let channel_list: any;
	let priv_messages: any;



	receptor.subscribe((value) => {
		aux_receptor = value;
		// console.log("User changed -> ", value)
	});

	mock_channels.subscribe((value) => {
		channel_list = value;
		// console.log("User changed -> ", value)
	});

	mock_priv_msg.subscribe((value) => {
		priv_messages = value;
		// console.log("User changed -> ", value)
	});

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		// scrollChatBottom();
		people = [...channel_list];
	});

	function filterChannel(keyword: string): void {
		displayChat = false;
		if (!keyword) {
			people = [...channel_list];
		} else {
			people = channel_list.filter((person: Group) => {
				return person.nickname.toLowerCase().includes(keyword.toLowerCase());
			});
		}
	}

	function avatarClick(person : any)
	{
		displayUserList = false;
		displayChat = true;
		currentPerson = person;

		// console.log("Persona seleccionada es -> ",currentPerson)
		receptor.set(currentPerson);
		chat_history.set([]);

		chat_history.set(currentPerson.messages);
	}

	function userListClick(person : any)
	{
		currentPerson = person;
		// console.log("Persona seleccionada es -> ",currentPerson)
		receptor.set(currentPerson);
		displayUserList = true;
		displayChat = false;

	}

</script>

<div class="card chat-card wrapper">

	<div class="list_channel ">
		<div class="border-b border-surface-500/30 p-4">
			<input class="input" type="search" placeholder="Search..." on:input={(e) => filterChannel(e.target.value)} />
		</div>

		<div class="user-list-container  p-4 space-y-4 overflow-y-auto">
			{#each people as person}
				<div class="list-item">
					<ListBoxItem bind:group={currentPerson} on:click={() => {avatarClick(person)}} name="people" value={person}>
						{person.nickname}
					</ListBoxItem>
					<button class='btn variant-ghost-surface' on:click={() => {avatarClick(person); userListClick(person)}}>User List</button>
				</div>
			{/each}
		</div>
	</div>
	{#if displayChat}
		<GroupChannelChat currentPerson={currentPerson}></GroupChannelChat>
	{/if}
	{#if displayUserList}
		<GroupChannelUserList currentPerson={currentPerson}></GroupChannelUserList>
	{/if}

</div>

<style>
    /* @import './chat.css'; */
	.chat-card{
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
			"a b b"
			"a b b";
	}

	.list_channel {
		grid-area: a;
		border-right: 1px solid rgba(151, 151, 151, 0.2);
		/* background-color: red; */
	}

	.item-container {
		display: flex;
		align-items: center;
	}

	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
