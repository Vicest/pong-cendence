<script lang="ts">
	import { AppBar, Avatar } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faTrophy, faInfo, faGamepad } from '@fortawesome/free-solid-svg-icons';
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
		}
	];
</script>

<!-- App Bar -->
<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<a href="/" aria-label="Home">
			<img src="/images/logo.png" alt="logo" class="h-10" />
		</a>
	</svelte:fragment>
	<svelte:fragment slot="default">
		<div class="flex justify-center space-x-4">
			{#each links as link, i}
				<a class="btn variant-ghost-surface" href={link.href}>
					<span class="border-r border-white pr-3">
						<Fa icon={link.icon} />
					</span>
					<span class="pl-1">
						{link.name}
					</span>
				</a>
			{/each}
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<Avatar
			src="https://cdn.intra.42.fr/users/82cfc9a1ea1ad97a890578e26b0ce0c9/aborboll.jpg"
			width="w-10"
			border="border border-white"
		/>
	</svelte:fragment>
</AppBar>
