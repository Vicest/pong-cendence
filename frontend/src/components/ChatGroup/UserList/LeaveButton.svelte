<script lang="ts">
	import { Avatar, CodeBlock, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import {
		chat_history,
		chat_receptor,
		joined_channels,
		receptor,
		unjoined_channels
	} from '../../../store/Chat';
	import { currentUser } from '../../../store/Auth';
	import { Api } from '$services/api';

	function leaveChannel(channel: any): void {
		console.log('Leave channel -> ', channel);
		if (
			$chat_receptor.members.find((users) => users.id == $currentUser.id).channel_status === 'Owner'
		) {
			alert('No puedes salirte del canal porque eres el dueño');
			return;
		}
		console.log('Peticion para salirme del canal -> ', $chat_receptor);
		Api.post('/chat/leave_channel', $chat_receptor).then((response: any) => {
			if (!response.data) {
				alert('Error al salir del canal');
				return;
			}
			console.log('Respuesta de salirme del canal -> ', response);
		});
	}
</script>

<div class="title-container" style="font-size: 22px">
	<button
		class="btn variant-ghost-surface"
		on:click={() => {
			leaveChannel($chat_receptor);
		}}
		>Leave Channel
	</button>
</div>
