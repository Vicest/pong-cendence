<script lang="ts">
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    import { mock_user } from "../../store/MOCK";
	import { chat_history, receptor } from '../../store/Chat';
    import RelationPanel from '../friends/RelationPanel.svelte';

    export let currentPerson : any;
    let elemChat: HTMLElement;
    let selectedPerson: any = null;
    let aux_user : any;

    
    mock_user.subscribe((value) => {
        aux_user = value;
    });

    function selectPerson(person: any): void {
        selectedPerson = person;
        receptor.set(person);
    }

    function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
		}
	}


</script>

<div class="div_area wrapper">
    <div class="perfil_area flex items-center space-x-6">
        <div class='title-container' style="font-size: 22px">  
            {currentPerson.nickname}
        </div>
    </div>
    <div bind:this={elemChat} class="chat_area max-h-[400px] p-4 overflow-y-auto space-y-4">
        <div style="font-size: 18px">
            <ListBox active="variant-filled-primary">
				{#each currentPerson.members as person}
					<ListBoxItem bind:group={currentPerson.members} on:click={() => {selectPerson(person)}} name="people" value={person}>
						<svelte:fragment slot="lead">
							<Avatar src="https://i.pravatar.cc/?img={person.avatar}" width="w-8" />
						</svelte:fragment>
                        {person.nickname}
                        {#if selectedPerson == person && selectedPerson.nickname != aux_user.nickname}
                            <RelationPanel currentPerson={person} />
                        {/if}


					</ListBoxItem>
				{/each}
			</ListBox>
        </div>
    </div>
    <div class="send_msg_area border-t border-surface-500/30 p-4">
        
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