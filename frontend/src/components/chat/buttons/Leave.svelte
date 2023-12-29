<script lang="ts">
	import type { ChannelsChat } from '$lib/types';
	import { currentUser } from '../../../store/Auth';
	import { channelList, sendLeaveChanneldRequest } from '../../../store/Chat';
	export let channel: ChannelsChat;
</script>

{#if channelList.iJoined(channel.id) && !channelList.isBanned(channel.id, $currentUser.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			sendLeaveChanneldRequest(channel.id);
		}}>Leave</button
	>
{/if}
