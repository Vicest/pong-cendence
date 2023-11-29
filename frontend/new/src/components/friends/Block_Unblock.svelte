<script lang="ts">

    import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    import { mock_blocked } from '../../store/MOCK';
	import type { Person } from '$lib/chat.model';
    
    export let currentPerson: Person;
    let blocked : any;
    let isBlocked : boolean;

    $:{
        isBlocked = blocked.some((friend: any) => friend.nickname === currentPerson.nickname);
    }

    mock_blocked.subscribe((value) => {
        blocked = value;
        // console.log("User changed -> ", value)
    });

    isBlocked = blocked.some((friend: any) => friend.nickname === currentPerson.nickname);

    function block_person(person : Person)
    {
        isBlocked = blocked.some((friend: any) => friend.nickname === person.nickname);
        if (!isBlocked) {
            blocked.push(person);
            mock_blocked.set(blocked);
            console.log("person was blocked -> ", person.nickname)
            isBlocked = true;
        }
    }

    function unblock_person(person : Person)
    {
        isBlocked = blocked.some((friend: any) => friend.nickname === person.nickname);
        if (isBlocked) {
            const index = blocked.findIndex((friend: any) => friend.nickname === person.nickname);
            
            blocked.splice(index, 1);
            mock_blocked.set(blocked);
            console.log("person was unblocked -> ", person.nickname)
            isBlocked = false;
        }
    }
    
</script>

{#if !isBlocked}
<button class='btn variant-ghost-surface' on:click={() => block_person(currentPerson)}>Block</button>
{/if}
{#if isBlocked}
<button class='btn variant-ghost-surface' on:click={() => unblock_person(currentPerson)}>Unblock</button>
{/if}
    