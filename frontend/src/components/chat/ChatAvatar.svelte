<script lang="ts">
	import type { Person } from '$lib/types';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let user: Person;
	export let width: string;
	export let showStatus: boolean = true;
	let color: string = '';

	$: {
		switch (user.status) {
			case 'online':
				color = 'bg-green-500';
				break;
			case 'offline':
				color = 'bg-gray-500';
				break;
			case 'busy':
				color = 'bg-yellow-500';
				break;
		}
	}
</script>

<div class="relative">
	<Avatar src={user.avatar} {width} />
	{#if showStatus}
		<div class="absolute right-0 top-0">
			<div class="w-3 h-3 rounded-full border-2 border-white {color}" />
		</div>
	{/if}
</div>
