<script lang="ts">
	import type { ChannelsChat } from '$lib/types';
	import { channelList, sendJoinChanneldRequest } from '../../../store/Chat';
	export let channel: ChannelsChat;
</script>

{#if !channelList.iJoined(channel.id)}
	<button
		type="button"
		class="btn variant-filled-primary"
		on:click={() => {
			sendJoinChanneldRequest(channel.id);
		}}>Join</button
	>
{/if}
