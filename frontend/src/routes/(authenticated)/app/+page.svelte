<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUser } from '../../../components/data/fetchUser.svelte';
	import { AppRail, AppRailAnchor, AppRailTile, Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { currentUser } from '../../../store/Auth';
	import Chat from '../../../components/chat/Chat.svelte';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">HOW TO PLAY</h2>
		<img src="/images/demopong.gif" alt="demopong" />
		<section class="img-bg" />
	</div>
</div>

<style lang="postcss">
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
