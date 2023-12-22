<script lang="ts">
	import type { Person } from '$lib/types';
	import { unblockUser, userList } from '../../../store/User';
	export let user: Person;
</script>

{#if userList.blockedByMe(user.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			unblockUser(user.id);
		}}>Unblock</button
	>
{/if}
