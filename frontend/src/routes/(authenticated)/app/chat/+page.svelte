<script lang="ts">
	import { page } from '$app/stores';
	import Chat from '../../../../components/chat/Chat.svelte';
</script>

<section class="card w-full h-full">
	<Chat showAllContacts={true} />
</section>
