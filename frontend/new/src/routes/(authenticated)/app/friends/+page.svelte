<script lang="ts">

	import { onMount, createEventDispatcher } from 'svelte';
	import AdminFriends from '../../../../components/friends/AdminFriends.svelte';
	import AddFriendPanel from '../../../../components/friends/AddFriendPanel.svelte';
	
	let addFriends = false;
	let showFriends = false;

	function showComponent(dato: any): void {
        showFriends = dato === 'Friends';
		addFriends = dato === 'Add';
    }
</script>

<div class="card grid">
    <button class="grid-item {showFriends ? 'active' : ''}" on:click={() => showComponent('Friends')}>Friends</button>
	<button class="grid-item {addFriends ? 'active' : ''}" on:click={() => showComponent('Add')}>Add Friends</button>
    
</div>
<div class="chat-container">
    {#if showFriends}
    	<AdminFriends />
    {/if}
	{#if addFriends}
    	<AddFriendPanel />
    {/if}
</div>

<style lang="postcss">
	.grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        grid-gap: 10px;
    }
  
    .grid-item {
      /* Estilos específicos para los botones */
      padding: 8px;
      border: 1px solid #480e46;
      background-color: #480e46;
      cursor: pointer;
    }

	.chat-container {
        /* Estilos para el contenedor del chat o amigos */
        display: grid;
        grid-gap: 10px;
    }

	.active {
    	background-color: lightyellow;
		color: black;
  	}
</style>
