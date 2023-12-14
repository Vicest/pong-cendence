<script lang="ts">

    import { mock_friends, receptor } from '../../store/Chat';
	import type { Person } from '$lib/types';

    let friends : any;
    let isFriend : boolean;


    mock_friends.subscribe((value) => {
        friends = value;
    });

    $:{
        isFriend = friends.some((friend: any) => friend.login === $receptor.login);
    }

    console.log ("EL RECEPTOR ES ", $receptor, friends)
    if ($receptor)
        isFriend = friends.some((friend: Person) => friend.login === $receptor.login);
    else
        isFriend = false;
    function add_friend(person : Person)
    {
        isFriend = friends.some((friend: any) => friend.nickname === person.nickname);
        if (!isFriend) {
            friends.push(person);
            mock_friends.set(friends);
            console.log("person was added as friend -> ", person.nickname)
            isFriend = true;
        }
    }

    function remove_friends(person: Person): void {
        isFriend = friends.some((friend: any) => friend.nickname === person.nickname);
        if (isFriend) {
            const index = friends.findIndex((friend: any) => friend.nickname === person.nickname);
            friends.splice(index, 1);
            mock_friends.set(friends);
            console.log("person was removed from friend -> ", person.nickname)
            isFriend = false;
        }
    }

</script>

{#if !isFriend}
<button class='btn variant-ghost-surface' on:click={() => add_friend($receptor)}>Add Friend</button>
{/if}
{#if isFriend}
<button class='btn variant-ghost-surface' on:click={() => remove_friends($receptor)}>Remove Friend</button>
{/if}

