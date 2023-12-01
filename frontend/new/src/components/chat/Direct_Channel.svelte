<script lang="ts">
	import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	// Global stores
	import type { Person } from '../../lib/chat.model';
	import { user } from "../../store/User";
	import { receptor , chat_history } from "../../store/Chat";
	import { mock_user_list ,mock_friends, mock_priv_msg } from "../../store/MOCK";
	// Components
	import Chat from './Direct_Channel_Chat.svelte';

	let people : Person[] = [];
	
	let currentPerson : any;
	let displayChat = false;
	
	let aux_user : any;
	let aux_receptor: any;
	let user_list: any;
	let priv_messages: any;

	$:{
		people = [...user_list];
		// sortByLastMsg();
		console.log("User sorted -> ", people)
	}
	
    user.subscribe((value) => {aux_user = value;});
	receptor.subscribe((value) => {aux_receptor = value;});
	mock_user_list.subscribe((value) => {user_list = value;});
	mock_priv_msg.subscribe((value) => {priv_messages = value;});

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		people = [...user_list];
	});

	function filterUsers(keyword: string): void {
		displayChat = false;
		if (!keyword) {
			people = [...user_list];
		} else {
			people = user_list.filter((person: Person) => {
				return person.nickname.toLowerCase().includes(keyword.toLowerCase());
			});
		}
	}


	function avatarClick(person : any)
	{
		
		displayChat = true;
		currentPerson = person
		
		// console.log("Persona seleccionada es -> ",currentPerson)
		receptor.set(currentPerson);
		chat_history.set([]);
		
		// console.log("Mensajes privados -> ",aux_user._privateMessages)
		chat_history.set(priv_messages.filter((msg : any) => {
			return (msg.sender.nickname == currentPerson.nickname || msg.receiver.nickname == currentPerson.nickname);
		}).sort((msgA :any, msgB: any) => {
			const dateA = new Date(msgA.created_at).getTime();
			const dateB = new Date(msgB.created_at).getTime();
			return dateA - dateB;
		}));
	}

</script>

<div class="card chat-card wrapper">

	<div class="item1 ">
		<div class="border-b border-surface-500/30 p-4">
			<input class="input" type="search" placeholder="Search..." on:input={(e) => filterUsers(e.target.value)} />
		</div>
		
		<div class="user-list-container p-4 space-y-4 overflow-y-auto">
			<ListBox active="variant-filled-primary">
				{#each people as person}
					<ListBoxItem bind:group={currentPerson} on:click={() => {avatarClick(person)}} name="people" value={person}>
						<svelte:fragment slot="lead">
							<Avatar src="https://i.pravatar.cc/?img={person.avatar}" width="w-8" />
						</svelte:fragment>
						{person.nickname}
					</ListBoxItem>
				{/each}
			</ListBox>
		</div>
	</div>
	<!-- <div class="item2">
		DISPLAY CHAT HERE -->
		{#if displayChat}
        	<Chat currentPerson={currentPerson}></Chat>
		{/if}
		
	<!-- </div> -->
	

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

	.item1 {
		grid-area: a;
		border-right: 1px solid rgba(151, 151, 151, 0.2);
		/* background-color: red; */
	}
	.item2 {
		grid-area: b;
		background-color: black;
	}

	
	/* .active-chat{

		 grid-template-columns: 30% 1fr;
		 
	}
	.active-friends{
		width: 90vw !important;
		left: auto;
	}

	.user-list-container {
		overflow-y: auto;
	} */
</style>