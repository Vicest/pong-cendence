<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	import axios from 'axios';
	// Components
	import type { Person, MessageFeed } from './chat.model';
	import Chat from './Chat.svelte';
	// import { mockpeople, mockmessageFeed } from './mockup'

    let messageFeed = []; //mockmessageFeed;
	let people = [];  //mockpeople;

	let elemChat: HTMLElement;
	let currentPerson: Person;
	let displayChat = false;
	//CSS PROPERTIES
	let cssDeployChat;
	$:{
		 cssDeployChat={
			widthlist: 100,
			widthcard: 30,
			leftcard: "4.8vw"

		}
	}

	// currentPerson.feed = mockmessageFeed;



	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		// elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		scrollChatBottom();
		await axios.get("http://localhost:3000/friends")
		.then(
		res => {
			if(res.status === 200)
			{
				people = res.data;

				currentPerson = people[0];
				console.log(people)

				axios.get("http://localhost:3000/receivedmsgs/" + currentPerson.name)
				.then(
				res => {
					// people = people.map((p)=>{  p.feed = []});
					currentPerson.feed = messageFeed;
					messageFeed = res.data;
				}).catch(err => {
					console.log(err)
				})

			}
		}
		)
		.catch(err => {
			console.log(err)
		})



	});

	function avatarClick(person)
	{
		
		displayChat = true;
		cssDeployChat.widthlist =30;
		cssDeployChat.widthcard = 90;
		cssDeployChat.leftcard = "auto";
		

		// logic reorder server BBDD recieved mesages and sent messages
		currentPerson = person;
		axios.get("http://localhost:3000/receivedmsgs/" + currentPerson.name)
		.then(
		res => {
			if(res.status === 200)
			{
				messageFeed = res.data;
				axios.get("http://localhost:3000/sendedmsgs/" + currentPerson.name)
				.then(res => {
					messageFeed = [...messageFeed, ...res.data];
					// console.log("sendedmsgs",res.data)
				})
			}
		}
		)
		.catch(err => {
			console.log(err)
		})
	}
</script>
<style>
    /* @import './chat.css'; */
	.chat-card{
		position: fixed;
		height: 72vh;
		width: 50vw;
		/* left: auto; */
	}
</style>

<!-- Slot: Sandbox -->
<section use:draggable class="card chat-card" style="width: {cssDeployChat.widthcard}vw;  left: {cssDeployChat.leftcard}">
	<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[{cssDeployChat.widthlist}%_1fr]">
		<!-- Navigation -->
		<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
			<!-- Header -->
			<div class="border-b border-surface-500/30 p-4">
				<input class="input" type="search" placeholder="Search..." />
			</div>
			<!-- List -->
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
