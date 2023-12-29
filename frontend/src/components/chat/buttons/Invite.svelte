<script lang="ts">
	import type { ChannelsChat, Person } from '$lib/types';
	import { sendFriendRequest, userList } from '../../../store/User';
	export let user: Person;
</script>

{#if !userList.invitedByMe(user.id) && !userList.invitedMe(user.id) && !userList.areFriends(user.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			sendFriendRequest(user.id);
		}}>Invite</button
	>
{/if}
