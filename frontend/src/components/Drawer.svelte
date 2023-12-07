<script lang="ts">
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import GameSelectorDrawer from '../components/game/SelectorDrawer.svelte';

	const drawerStore = getDrawerStore();
</script>

<Drawer>
	{#if $drawerStore.id === 'battle-zone'}
		<GameSelectorDrawer />
	{/if}
</Drawer>
