<script lang="ts">
	import '../../../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Sidebar from '../../../components/Sidebar.svelte';
	import Header from '../../../components/Header.svelte';
	import Footer from '../../../components/Footer.svelte';

	import { currentUser } from '../../../store/Auth';

	let currentTile: number = 0;

	/** @type {import('./$types').LayoutData}*/
	// export let data: any;
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Sidebar />
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
