<script lang="ts">

import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	// Global stores
	import type { Person } from '../../lib/chat.model';
	import { user } from "../../store/User";
	import { receptor , chat_history } from "../../store/Chat";
	import { mock_user_list ,mock_friends, mock_priv_msg } from "../../store/MOCK";
	// Components
	import Chat from '../chat/Direct_Channel_Chat.svelte';

	let people : Person[] = [];
	
	let currentPerson : any;
	let displayChat = false;
	
	let aux_user : any;
	let aux_receptor: any;
	let user_list: any;
	let priv_messages: any;
	
    user.subscribe((value) => {
        aux_user = value;
        // console.log("User changed -> ", value)
    });

	receptor.subscribe((value) => {
		aux_receptor = value;
		// console.log("User changed -> ", value)
	});

	mock_friends.subscribe((value) => {
		user_list = value;
		// console.log("User changed -> ", value)
	});

	mock_priv_msg.subscribe((value) => {
		priv_messages = value;
		// console.log("User changed -> ", value)
	});

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		// scrollChatBottom();
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

        console.log("Historial de chat -> ",displayChat);
        console.log("currentPerson -> ",currentPerson);
	}

    function removeFromFriends(person: any): void {
    const index = user_list.findIndex((friend: any) => friend.nickname === person.nickname);
    if (index !== -1) {
      user_list.splice(index, 1);
      people = [...user_list];
    }
  }

</script>

<section class:active-friends={displayChat} class="card chat-card" >
	<div class:active-chat={displayChat} class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[100%_1fr]">
		
		<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
			
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
                            <button class="m1 auto" on:click={() => removeFromFriends(person)}>X</button>
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>
		</div>
		{#if displayChat}
        	<Chat currentPerson={currentPerson}></Chat>
		{/if}
	</div>

</section>


<style>
    /* Estilos para la sección de amigos y chat */
    .chat-card {
      z-index: 4;
      position: fixed;
      height: 100vh;
      width: 93vw;
      display: flex;
      flex-direction: column;
    }
  
    .chat {
      display: grid;
      grid-template-columns: 30% 1fr;
      height: 100%;
    }
  
    .user-list-container button {
        
        margin-right: auto; /* Espacio entre el nombre y el botón */
    }
  </style>