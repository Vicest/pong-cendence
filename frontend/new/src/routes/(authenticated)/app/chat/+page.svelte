<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import Direct_Channel from '../../../../components/chat/Direct_Channel.svelte';
    import GroupChannel from '../../../../components/chat/Group_Channel.svelte';
    // import {AdminFriends} from '../../../../components/friends/AdminFriends.svelte';
    import AdminFriends from '../../../../components/friends/AdminFriends.svelte';

    let showDirect = false;
    let showGroup = false;
    let showAdminFriends = false;

    const dispatch = createEventDispatcher();

    function showComponent(component: string): void {
        console.log('showComponent', component);
        showDirect = component === 'Direct';
        showGroup = component === 'Group';
        showAdminFriends = component === 'Admin';
    }
</script>

<div class="card grid">
    <button class="grid-item" on:click={() => showComponent('Direct')}>Mensajes Directos</button>
    <button class="grid-item" on:click={() => showComponent('Group')}>Grupos</button>
    <button class="grid-item" on:click={() => showComponent('Admin')}>Administrar Amigos</button>
    
</div>
<div class="chat-container">
    {#if showDirect}
    <Direct_Channel />
    {/if}
    
    {#if showGroup}
    <GroupChannel />
    {/if}
    
    {#if showAdminFriends}
    <AdminFriends />
    {/if}
</div>

  <style>
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
  </style>
  