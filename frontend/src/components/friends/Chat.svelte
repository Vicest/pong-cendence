<script lang="ts">
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import axios from 'axios';


    export let messageFeed;
    export let currentPerson;
	let elemChat: HTMLElement;


    let currentMessage = '';

    function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}
    function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}


	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
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


</script>

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