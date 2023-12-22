<script lang="ts">
	import type { Person } from '$lib/types';
	import { blockUser, userList } from '../../../store/User';
	export let user: Person;
</script>

{#if userList.areFriends(user.id) && !userList.blockedByMe(user.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			blockUser(user.id);
		}}>Block</button
	>
{/if}
