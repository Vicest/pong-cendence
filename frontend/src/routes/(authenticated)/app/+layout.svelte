<script lang="ts">
	import '../../../app.postcss';
	import { AppShell, initializeStores } from '@skeletonlabs/skeleton';
	import Sidebar from '../../../components/Sidebar.svelte';
	import Toast from '../../../components/Toast.svelte';
	import Header from '../../../components/Header.svelte';
	import Footer from '../../../components/Footer.svelte';
	import Drawer from '../../../components/Drawer.svelte';
	import Modal from '../../../components/Modal.svelte';
	import { loading, init as AuthInit } from '../../../store/Auth';
	import { init as UsersInit } from '../../../store/User';
	import { init as GameInstancesInit } from '../../../store/Game';
	import { init as MatchmakingInstancesInit } from '../../../store/Matchmaking';
	import { init as ChatInstancesInit } from '../../../store/Chat';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	initializeStores();
	onMount(() => {
		AuthInit()
			.then(() => {
				console.log('Auth initialized');
				Promise.all([
					UsersInit(),
					GameInstancesInit(),
					MatchmakingInstancesInit(),
					ChatInstancesInit()
				]);
			})
			.catch((err) => {
				console.log(err);
				if (err.statusCode === 403 || err.statusCode === 401) {
					goto('/login');
				} else if (err.statusCode === 400 && err.message === '2FA not validated') {
					goto('/login/2fa');
				} else if (err.statusCode === 400 && err.message === 'User is banned') {
					goto('/banned');
				} else {
					goto('/login');
				}
			});
	});
</script>

<!-- App Shell -->
{#if $loading}
	<div class="flex justify-center items-center h-screen animate-pulse">
		<img src="/images/logo.png" alt="logo" class="h-20" />
	</div>
{:else}
	<Drawer />
	<Toast />
	<Modal />
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
