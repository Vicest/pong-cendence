<!-- Login Page -->
<script>
	import { ApiUrl } from '../../store/Common';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
        // Redirige a la página de login al cargar el componente
        goto('/login');
    });
</script>

