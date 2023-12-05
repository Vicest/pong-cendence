<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	// Components
	import type { Person, MessageFeed } from './chat.model';
	import Chat from './Chat.svelte';
	import { user } from "../../../../store/User";
	import { type_Channel , receptor , chat_history } from "../../../../store/Chat";

    let messageFeed : any = [];
	let people : Person[] = [];
	
	let elemChat: HTMLElement;
	let currentPerson : any;
	let displayChat = false;
	
	let aux_user : any;
	let currentChannel : any;
	let aux_receptor: any;

	$: {
		messageFeed = $chat_history;
    }
	
    user.subscribe((value) => {
        aux_user = value;
        // console.log("User changed -> ", value)
    });

	type_Channel.subscribe((value) => {
		currentChannel = value;
		// console.log("User changed -> ", value)
	});

	receptor.subscribe((value) => {
		aux_receptor = value;
		// console.log("User changed -> ", value)
	});
	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		// elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		scrollChatBottom();
		type_Channel.set("Friend");
		people = [...aux_user.friends];
		// console.log("people ->", people)
		// console.log("Mis amigos son -> ",people);

	});

	function avatarClick(person : any)
	{
		
		displayChat = true;
		currentPerson = person
		
		// console.log("Persona seleccionada es -> ",currentPerson)
		receptor.set(currentPerson);
		chat_history.set([]);
		if (currentChannel == "Friend")
		{
			// console.log("Mensajes privados -> ",aux_user._privateMessages)
			chat_history.set(aux_user._privateMessages.filter((msg : any) => {
				return (msg.sender.nickname == currentPerson.nickname || msg.receiver.nickname == currentPerson.nickname);
			}).sort((msgA :any, msgB: any) => {
				const dateA = new Date(msgA.created_at).getTime();
				const dateB = new Date(msgB.created_at).getTime();
				return dateA - dateB;
			}));
		}
		else if (currentChannel == "Group")
			chat_history.set(currentPerson.messages);
		
		messageFeed = $chat_history;
	}

	function Contacts_Friends()
	{
		if (currentChannel != "Friend")
			displayChat = false;
		type_Channel.set("Friend");
		people = [...aux_user.friends];
		// console.log("Cambie de canal")
	}

	function Contacts_Channels()
	{
		if (currentChannel != "Group")
			displayChat = false;
		type_Channel.set("Group");
		people = [...aux_user.channels];
		// console.log("Cambie de canal")
	}

</script>
<style>
    /* @import './chat.css'; */
	.chat-card{
		z-index: 4;
		position: fixed;
		height: 72vh;
		width: 50vw;
	}
	.active-chat{

		 grid-template-columns: 30% 1fr;
		 
	}
	.active-friends{
		width: 90vw !important;
		left: auto;
	}
</style>


<section use:draggable={{bounds: 'parent'}} class:active-friends={displayChat} class="card chat-card" style="width: 30vw;  left: 4.8vw">
	<div class:active-chat={displayChat} class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[100%_1fr]">
		
		<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
			
			<div class="border-b border-surface-500/30 p-4">
				<input class="input" type="search" placeholder="Search..." />
			</div>
			
			<div class="p-4 space-y-4 overflow-y-auto">
				<button class="opacity-50" on:click={() => {Contacts_Friends()}}>Friends</button>
				<button class="opacity-50" on:click={() => {Contacts_Channels()}}>Channels</button>
				<ListBox active="variant-filled-primary">
					{#each people as person}
						<ListBoxItem bind:group={currentPerson} on:click={() => {avatarClick(person)}} name="people" value={person}>
							<svelte:fragment slot="lead">
								<Avatar src="https://i.pravatar.cc/?img={person.avatar}" width="w-8" />
							</svelte:fragment>
							{currentChannel} : {person.nickname}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>
		</div>
		{#if displayChat}
        	<Chat messageFeed={messageFeed} currentChannel={currentChannel} currentPerson={currentPerson}></Chat>
		{/if}
	</div>

</section>