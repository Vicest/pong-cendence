<script lang="ts">
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { chat_history } from '../../store/Chat';
	import { currentUser } from '../../store/Auth';

    export let currentPerson : any;
    let elemChat: HTMLElement;
    let currentMessage = '';
    let messageFeed : any;

    chat_history.subscribe((value) => {
        messageFeed = value;
    });

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
            sender: $currentUser,
            receiver: currentPerson,
            content: currentMessage,
            created_at: new Date().toLocaleString(),
        };

        messageFeed.push(msg);
        chat_history.set(messageFeed);

		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
            scrollChatBottom('smooth');
		}, 0);

        console.log("Mensaje grupo -> ",msg)
		currentMessage = '';
        // scrollChatBottom();
	}


</script>

<div class="div_area wrapper">
    <div class="perfil_area flex items-center space-x-6">
        <div class='title-container' style="font-size: 22px">
            {currentPerson.nickname}
        </div>
    </div>
    <div bind:this={elemChat} class="chat_area max-h-[400px] p-4 overflow-y-auto space-y-4">
        {#each messageFeed as bubble}
            {#if bubble.sender.nickname != $currentUser.nickname}
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
    </div>
    <div class="send_msg_area border-t border-surface-500/30 p-4">
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
    </div>

</div>

<style>

    .wrapper {
		display: grid;
		grid-template-rows: 10% 60% auto;
		grid-template-areas:
			"c c c"
			"d d d"
			"e e e";
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
