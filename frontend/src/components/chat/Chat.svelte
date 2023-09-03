<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';
	// Components
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import type { Person, MessageFeed } from './chat.model';
	// import { mockpeople, mockmessageFeed } from './mockup'

	let messageFeed = []; //mockmessageFeed;
	let people = [];  //mockpeople;

	let elemChat: HTMLElement;
	let currentPerson: Person;
	// currentPerson.feed = mockmessageFeed;

	let currentMessage = '';

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	function addMessage(): void {
		const newMessage = {
			id: messageFeed.length,
			host: true,
			avatar: 13,
			sender: 'Marcos',
			receiver: currentPerson.name,
			date: `Today @ ${getCurrentTimestamp()}`,
			text: currentMessage
		};
		
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);

		// Here logic, send server messages and save on cache those messages
		currentPerson.feed = messageFeed;
		console.log("Current Person: ", currentPerson)

		axios.post("http://localhost:3000/msg", newMessage)
		.then(res => {})
		.catch(err => {
			console.log(err)
		})
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
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
				// console.log(people)
				
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
	let selectedvalue;
	function avatarClick(person)
	{
		
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
		height: 72vh;
		width: 90vw;
	}
</style>

<!-- Slot: Sandbox -->
<section class="card chat-card">
	<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
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
			<!-- Footer -->
			<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
		</div>
		<!-- Chat -->
		<div class="grid grid-row-[1fr_auto]">
			<!-- Conversation -->
			<section bind:this={elemChat} class="max-h-[500px] p-4 overflow-y-auto space-y-4">
				{#each messageFeed as bubble}
					{#if bubble.host === true}
						<div class="grid grid-cols-[auto_1fr] gap-2">
							<Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
							<div class="card p-4 variant-soft rounded-tl-none space-y-2">
								<div class="flex justify-between items-center">
									<p class="font-bold">{bubble.sender}</p>
									<small class="opacity-50">{bubble.date}</small>
								</div>
								<p>{bubble.text}</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
								<div class="flex justify-between items-center">
									<p class="font-bold">{bubble.sender}</p>
									<small class="opacity-50">{bubble.date}</small>
								</div>
								<p>{bubble.text}</p>
							</div>
							<Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
						</div>
					{/if}
				{/each}
			</section>
			<!-- Prompt -->
			<section class="border-t border-surface-500/30 p-4">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
					<button class="input-group-shim">+</button>
					<textarea
						bind:value={currentMessage}
						class="bg-transparent border-0 ring-0"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
						on:keydown={onPromptKeydown}
					/>
					<button class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'} on:click={addMessage}>
						<i class="fa-solid fa-paper-plane" />
					</button>
					
				</div>
			</section>
		</div>
	</div>
</section>
