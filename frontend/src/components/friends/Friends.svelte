
<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	// import { env } from '$env/dynamic/private'
	import { onMount } from 'svelte';
	import axios from 'axios';
	// Components
	import type { Person, MessageFeed } from './chat.model';
	import Chat from './Chat.svelte';
	import { apiData } from '../../services/my42data';
	import { io } from 'socket.io-client';
	import { historical_msg } from "../../store";

    let messageFeed = []; //mockmessageFeed;
	let people = [];

	let elemChat: HTMLElement;
	let currentPerson: Person;
	let displayChat = false;
	let socket;
	let apidata;
	let historic;

    async function fetchData() {
    return new Promise((resolve) => {
        apiData.subscribe((data) => {
        apidata = data;
        console.log(data.login);
        resolve();
        });
    });
    }

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		// elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		await fetchData();
		socket = io(`http://localhost:5000`); 
		
		
		scrollChatBottom();

		fetch(`http://localhost:5000/api/friends/`+ apidata.login, {
			headers : {
				'Access-Control-Allow-Origin' : '*'
			}
		})
      			.then(response => {
      			  if (!response.ok) {
      			    throw new Error('La solicitud no se completó correctamente');
      			  }
      			  return response.json();
      			})
      			.then(data => {

					const uniqueNames = new Set();

            		// Agregar los nombres de "User1" a los nombres únicos
            		// data
            		//     .filter(item => item.User1.trim() !== apidata.login)
            		//     .map(item => uniqueNames.add(item.User1.trim()));

            		// // Agregar los nombres de "User2" a los nombres únicos
            		// data
            		//     .filter(item => item.User2.trim() !== apidata.login)
            		//     .map(item => uniqueNames.add(item.User2.trim()));
					

					data
            		    .map(item => uniqueNames.add(item.User1.trim()));

            		// Agregar los nombres de "User2" a los nombres únicos
            		data
            		    .map(item => uniqueNames.add(item.User2.trim()));

            		// Convertir el conjunto a una lista de objetos
            		people = [...uniqueNames].map(name => ({ name }));

            		console.log(people);
      			  // Manejar los datos
      			})
      			.catch(error => {
      			  console.error('Error de fetch:', error);
      			});
			
				  socket.on('recv_historial_response', (res) => {
			console.log("Historial obtenido", res);
            historical_msg.set(res.msg)
			// Puedes procesar la respuesta del servidor aquí
		}).on('error', (err) => {
			console.log("Error ? -> " + err);
		});
		

	});

	function avatarClick(person) {
		displayChat = true;
		currentPerson = person;
		messageFeed = [];



		// Emitir un evento al servidor
		console.log("Historico establecido en amigos antes -> "+ historic);
		socket.emit('recv_historial', { receptor: person.name, emisor: apidata.login });


		historical_msg.subscribe((prev_val) => historic = prev_val)
		console.log("Historico establecido en amigos despues -> "+ historic);
		
		
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
				<button class="opacity-50">Contacts</button>
				<button class="opacity-50">Channels</button>
				<ListBox active="variant-filled-primary">
					{#each people as person}
						<ListBoxItem bind:group={currentPerson} on:click={() => {avatarClick(person)}} name="people" value={person}>
							<svelte:fragment slot="lead">
								<Avatar src="https://i.pravatar.cc/?img={person.avatar}" width="w-8" />
							</svelte:fragment>
							{person.name}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>
		</div>
		{#if displayChat}
        	<Chat messageFeed={messageFeed} currentPerson={currentPerson}></Chat>
		{/if}
	</div>

</section>
