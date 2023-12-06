<script lang="ts">
	import '../../../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import Sidebar from '../../../components/Sidebar.svelte';
	import Header from '../../../components/Header.svelte';
	import Footer from '../../../components/Footer.svelte';
	import { loading, init as AuthInit } from '../../../store/Auth';
	import { init as UsersInit } from "../../../store/User";
	import { onMount } from 'svelte';

	onMount(() => {
		AuthInit();
		UsersInit();
	});
</script>

<!-- App Shell -->

{#if $loading}
<div class="flex justify-center items-center h-screen animate-pulse">
	<a href="/" aria-label="Home">
		<img src="/images/logo.png" alt="logo" class="h-10" />
	</a>
</div>
{:else}
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
{/if}
