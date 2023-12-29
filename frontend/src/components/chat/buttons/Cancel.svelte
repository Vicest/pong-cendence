<script lang="ts">
	import type { Person } from '$lib/types';
	import { cancelFriendRequest, userList } from '../../../store/User';
	export let user: Person;
</script>

{#if userList.invitedByMe(user.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			cancelFriendRequest(user.id);
		}}>Cancel</button
	>
{/if}
