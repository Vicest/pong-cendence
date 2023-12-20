<script lang="ts">
	import { Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	import TargetSelectorModal from './game/TargetSelectorModal.svelte';
	import ChatFinderModal from './chat/ChatFinderModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		targetSelectorModal: { ref: TargetSelectorModal },
		chatFinderModal: { ref: ChatFinderModal }
	};
</script>

<Modal components={modalRegistry} />
