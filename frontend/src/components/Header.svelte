<script lang="ts">
	import { page } from '$app/stores';
	import { AppBar, Avatar, getDrawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faTrophy, faInfo, faMessage } from '@fortawesome/free-solid-svg-icons';
	import { faBattleNet } from '@fortawesome/free-brands-svg-icons';
	import { currentUser } from '../store/Auth';
	import { gameListDrawerSettings } from '../store/Game';
	import ChatAvatar from './chat/ChatAvatar.svelte';
	const drawerStore = getDrawerStore();
	drawerStore.close();

	let links = [
		{
			name: 'Leadboard',
			href: '/app/leadboard',
			icon: faTrophy
		},
		{
			name: 'About',
			href: '/app/about',
			icon: faInfo
		},
		{
			name: 'Chat',
			href: '/app/chat',
			icon: faMessage
		}
	];
</script>

<!-- App Bar -->
<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<a href="/app" aria-label="Home">
			<img src="/images/logo.png" alt="logo" class="site-logo md:h-10 h-5" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="default">
		<div class="flex justify-center space-x-4">
			{#each links as link, i}
				<a class="btn variant-ghost-surface z-10" href={link.href}>
					<span class="md:border-r md:border-primary md:pr-3">
						<Fa icon={link.icon} />
					</span>
					<span class="pl-1 hidden md:inline-block">
						{link.name}
					</span>
				</a>
			{/each}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<span class="hidden md:inline-block text-primary">
			{$currentUser.nickname}
		</span>
		<a href="/app/profile">
			<ChatAvatar bind:user={$currentUser} width="w-10" />
		</a>
	</svelte:fragment>
</AppBar>
{#if $drawerStore.open === false && !$page.url.pathname.startsWith('/app/arena')}
	<div class="hidden lg:block lg:fixed bottom-0 right-0 z-10 p-4">
		<button
			on:click={() => drawerStore.open($gameListDrawerSettings)}
			class="btn bg-gradient-to-br variant-gradient-secondary-primary rounded-full shadow-lg flex items-center justify-center btn-xl"
		>
			<span>Battle zone</span>
			<span><Fa icon={faBattleNet} class="mt-1" /></span>
		</button>
	</div>
{/if}

<style>
	:global(html):not(.dark) .site-logo {
		filter: invert(1);
	}
</style>
