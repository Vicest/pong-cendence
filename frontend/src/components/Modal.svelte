<script lang="ts">
	import { Modal, type ModalComponent } from '@skeletonlabs/skeleton';
	import TargetSelectorModal from './game/TargetSelectorModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		targetSelectorModal: { ref: TargetSelectorModal }
	};
</script>

<Modal components={modalRegistry} />
