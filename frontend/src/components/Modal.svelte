<script lang="ts">
	import { Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	import TargetSelectorModal from './game/TargetSelectorModal.svelte';
	import ChatFinderModal from './chat/ChatFinderModal.svelte';
	import ChatCreatorModal from './chat/ChatCreatorModal.svelte';
	import ChannelDetailsModal from './chat/ChannelDetailsModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		targetSelectorModal: { ref: TargetSelectorModal },
		chatFinderModal: { ref: ChatFinderModal },
		chatCreatorModal: { ref: ChatCreatorModal },
		channelDetailsModal: { ref: ChannelDetailsModal }
	};
</script>

<Modal components={modalRegistry} zIndex="z-40" />
