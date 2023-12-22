<script lang="ts">
	import type { ChannelsChat } from '$lib/types';
	import { channelList, sendDeleteChanneldRequest } from '../../../store/Chat';
	export let channel: ChannelsChat;
</script>

{#if channelList.iJoined(channel.id) || channelList.iOwn(channel.id)}
	<button
		type="button"
		class="btn variant-filled-error"
		on:click={() => {
			sendDeleteChanneldRequest(channel.id);
		}}>Delete</button
	>
{/if}
