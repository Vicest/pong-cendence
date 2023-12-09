<script lang="ts">
    import { page } from '$app/stores';
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<div>
		{#if $page?.error}
			<div class="flex text-5xl justify-center items-center h-screen">
				{#if $page?.error?.message && $page?.status}
					<h2>{$page?.status} - Error: {$page?.error?.message}</h2>
				{/if}
			</div>
		{/if}
	</div>
</AppShell>