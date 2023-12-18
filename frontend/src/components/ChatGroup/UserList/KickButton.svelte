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
	import type { Channel } from '$lib/types';

	function validateKick() {
		let status_kicker =
			$chat_receptor.members[
				$chat_receptor.members.findIndex((users) => users.id == $currentUser.id)
			].channel_status;
		let status_kicked =
			$chat_receptor.members[$chat_receptor.members.findIndex((users) => users.id == $receptor.id)]
				.channel_status;
		if (status_kicker == 'Member' || status_kicker == 'Invited') return false;
		if (status_kicked == 'Owner' || (status_kicked == 'Admin' && status_kicker == 'Admin'))
			return false;
		return true;
	}

	function kickfromchannel(): void {
		console.log('Leave channel -> ', receptor);

		if (!validateKick()) {
			alert('No se puede kickear a la persona');
			return;
		}
		Api.post('/chat/kickFromChannel', [$chat_receptor, $receptor]).then((response: any) => {
			if (!response.data) {
				alert('Error al kickear del canal');
				return;
			}
			console.log('Kickeado del canal -> ', response);
		});
	}
</script>

<div class="title-container" style="font-size: 22px">
	<button
		class="btn variant-ghost-surface"
		on:click={() => {
			kickfromchannel();
		}}
		>Kick
	</button>
</div>
