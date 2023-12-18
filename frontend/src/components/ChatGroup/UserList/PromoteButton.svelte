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

	function validateRanges() {
		let status_kicker =
			$chat_receptor.members[
				$chat_receptor.members.findIndex((users) => users.id == $currentUser.id)
			].channel_status;
		let status_kicked =
			$chat_receptor.members[$chat_receptor.members.findIndex((users) => users.id == $receptor.id)]
				.channel_status;
		if (status_kicker == 'Member' || status_kicker == 'Invited' || status_kicked == 'Admin')
			return false;
		if (status_kicked == 'Owner' || status_kicker == 'Admin') return false;
		return true;
	}

	function promote(): void {
		console.log('Promover en canal channel -> ', $chat_receptor);
		if (!validateRanges()) alert('No se puede promover a la persona');
		Api.post('/chat/promote', [$chat_receptor, $receptor]).then((response: any) => {
			if (!response.data) {
				alert('Error al promover en el canal');
				return;
			}
			console.log('Respuesta de promover en el canal -> ', response);
		});
	}
</script>

<div class="title-container" style="font-size: 22px">
	<button
		class="btn variant-ghost-surface"
		on:click={() => {
			promote();
		}}
		>Promote
	</button>
</div>
