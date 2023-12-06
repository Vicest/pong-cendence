<script lang="ts">
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { user } from '../../../../store/User';
    import { aux_socket } from "../../../../store/Socket";

    let aux_user : any;
    let socket : any;

    user.subscribe((value) => {
        aux_user = value;
        // console.log("User changed -> ", value)
    });

    aux_socket.subscribe((value) => {
        socket = value;
        // console.log("User changed -> ", value)
    });

    // Inicializar la conexión de socket.io    
    onMount(async () => {
        //console.log("Al abrir el chat , nuestro historial de mensajes es ", $msg_history)
    });
    
    export let messageFeed : any;
    export let currentPerson : any;
    export let currentChannel: any;

	let elemChat: HTMLElement;
    let currentMessage = '';

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

        if (currentMessage == '')
            return
        
        let msg = {
            sender: aux_user,
            receiver: currentPerson,
            content: currentMessage,
        };
		
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
            scrollChatBottom('smooth');
		}, 0);
        
        if (currentChannel == "Group")
            socket.emit('group_message', msg);
        else
            socket.emit('priv_message', msg);

        console.log("Mensaje enviado -> ",msg)
		currentMessage = '';
	}


</script>


<div class="grid grid-row-[1fr_auto]">
    <section bind:this={elemChat} class="max-h-[500px] p-4 overflow-y-auto space-y-4">
        {#each messageFeed as bubble}
            {#if bubble.sender.nickname != aux_user.nickname}
                <div class="grid grid-cols-[auto_1fr] gap-2">
                    <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
                    <div class="card p-4 variant-soft rounded-tl-none space-y-2">
                        <div class="flex justify-between items-center">
                            <p class="font-bold">{bubble.sender.nickname}</p>
                            <small class="opacity-50">{bubble.created_at}</small>
                        </div>
                        <p>{bubble.content}</p>
                    </div>
                </div>
            {:else}
                <div class="grid grid-cols-[1fr_auto] gap-2">
                    <div class="card p-4 rounded-tr-none space-y-2 variant-soft-primary">
                        <div class="flex justify-between items-center">
                            <p class="font-bold">{bubble.sender.nickname}</p>
                            <small class="opacity-50">{bubble.created_at}</small>
                        </div>
                        <p>{bubble.content}</p>
                    </div>
                    <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
                </div>
            {/if}
        {/each}
    </section>
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