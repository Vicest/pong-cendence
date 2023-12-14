<script lang="ts">

    import { Avatar, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    import { mock_blocked , receptor} from '../../store/Chat';
	import type { Person } from '$lib/types';

    let blocked : any;
    let isBlocked : boolean;

    $:{
        isBlocked = blocked.some((friend: any) => friend.login === $receptor.login);
    }

    mock_blocked.subscribe((value) => {
        blocked = value;
    });

    if ($receptor)
        isBlocked = blocked.some((friend: any) => friend.login === $receptor.login);
    else
        isBlocked = false;
    
    function block_person(person : Person)
    {
        isBlocked = blocked.some((friend: any) => friend.nickname === person.nickname);
        if (!isBlocked) {
            blocked.push(person);
            mock_blocked.set(blocked);
            // console.log("person was blocked -> ", person.nickname)
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
            // console.log("person was unblocked -> ", person.nickname)
            isBlocked = false;
        }
    }

</script>

{#if !isBlocked}
<button class='btn variant-ghost-surface' on:click={() => block_person($receptor)}>Block</button>
{/if}
{#if isBlocked}
<button class='btn variant-ghost-surface' on:click={() => unblock_person($receptor)}>Unblock</button>
{/if}
