<style>
	:global(html):not(.dark) .site-logo {
		filter: invert(1);
	}
</style>


<script lang="ts">
	import { AppBar, Avatar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faTrophy, faInfo, faGamepad, faMessage } from '@fortawesome/free-solid-svg-icons';
	import { currentUser } from '../store/Auth';

	import { page } from '$app/stores';

	let currentTile: number = 0;
	let links = [
		{
			name: 'Leadboard',
			href: '/app/leadboard',
			icon: faTrophy
		},
		{
			name: 'Arena',
			href: '/app/arena',
			icon: faGamepad
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
				<a class="btn variant-ghost-surface z-10" href="{link.href}">
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
			{ $currentUser.nickname }
		</span>
		<a href="/app/profile">
			<Avatar
				src="{ $currentUser.avatar }"
				width="w-10"
				border="border border-primary"
			/>
		</a>
	</svelte:fragment>
</AppBar>

