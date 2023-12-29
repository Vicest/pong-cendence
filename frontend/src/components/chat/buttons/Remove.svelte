<script lang="ts">
	import type { Person } from '$lib/types';
	import { removeFriend, userList } from '../../../store/User';
	export let user: Person;
</script>

{#if userList.areFriends(user.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			removeFriend(user.id);
		}}>Remove</button
	>
{/if}
