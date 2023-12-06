<script lang="ts">
	import type { Person } from '$lib/types';
    import AddRemoveFriend from './AddRemoveFriend.svelte';
    import BlockUnblock from './Block_Unblock.svelte';

    export let currentPerson: Person;


</script>

<div>
    <AddRemoveFriend currentPerson={currentPerson}></AddRemoveFriend>
    <BlockUnblock currentPerson={currentPerson}></BlockUnblock>
</div>
