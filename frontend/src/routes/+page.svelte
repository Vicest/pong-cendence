<script lang="ts">
  import Home from './home/+page.svelte'
  import Login from './login/Login.svelte'
  import { onMount } from 'svelte';
  import { auth } from './vars.d';
  import { apiData } from '../services/my42data';
  import { waitingD } from './vars.d';

  let authenticated=false;
	auth.subscribe(value => {
		authenticated = value;
	});

  let waiting=true;
	waitingD.subscribe(value => {
		waiting = value;
	});
  
  onMount(async () => {

  })

</script>

{#if authenticated == false}
  <Login waiting={waiting}></Login>
{:else}
  <!-- {#if currentPage}
        <svelte:component this={currentPage} />
    {:else}
        <p>Page not found</p>
  {/if} -->
  <Home></Home>
{/if}

