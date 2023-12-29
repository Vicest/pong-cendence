<script lang="ts">
	import type { ChannelsChat } from '$lib/types';
	import { ChatSocket } from '$services/socket';
	import { currentUser } from '../../store/Auth';
	import { channelList } from '../../store/Chat';
	import { userList } from '../../store/User';

	export let channel: ChannelsChat;
	export let currentMessage: string = '';
	export let elemChat: HTMLElement;

	function addMessage() {
		ChatSocket.emit('channel_message', {
			message: currentMessage,
			channel: channel.id
		});
		currentMessage = '';
	}

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			addMessage();
			setTimeout(() => {
				scrollChatBottom('smooth');
			}, 50);
		}
	}
</script>

<!-- Prompt -->
<section class="p-4 overflow-y-auto space-y-4 max-h-[1150px]">
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
		<button class="input-group-shim">+</button>
		<textarea
			bind:value={currentMessage}
			class="bg-transparent border-0 ring-0"
			name="prompt"
			id="prompt"
			placeholder="Write a message..."
			rows="1"
			disabled={userList.blockedMe(channel.user.id) ||
				userList.blockedByMe(channel.user.id) ||
				!(channel.type === 'Channel' || userList.areFriends(channel.user.id)) ||
				(channel.type === 'Channel' && channelList.isBanned(channel.id, $currentUser.id)) ||
				(channel.type === 'Channel' && channelList.isMuted(channel.id, $currentUser.id)) ||
				(channel.type === 'Channel' && !channelList.iJoined(channel.id))}
			on:keydown={onPromptKeydown}
		/>
		<button
			class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
			on:click={addMessage}
			disabled={userList.blockedMe(channel.user.id) ||
				userList.blockedByMe(channel.user.id) ||
				!(channel.type === 'Channel' || userList.areFriends(channel.user.id)) ||
				(channel.type === 'Channel' && channelList.isBanned(channel.id, $currentUser.id)) ||
				(channel.type === 'Channel' && channelList.isMuted(channel.id, $currentUser.id)) ||
				(channel.type === 'Channel' && !channelList.iJoined(channel.id))}
		>
			<i class="fa-solid fa-paper-plane" />
		</button>
	</div>
</section>
