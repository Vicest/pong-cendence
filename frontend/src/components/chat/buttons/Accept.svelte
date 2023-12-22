<script lang="ts">
	import type { Person } from '$lib/types';
	import { acceptUser, userList } from '../../../store/User';
	export let user: Person;
</script>

{#if userList.invitedMe(user.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			acceptUser(user.id);
		}}>Accept</button
	>
{/if}
