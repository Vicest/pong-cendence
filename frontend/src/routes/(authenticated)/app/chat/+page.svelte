<script lang="ts">
	import Direct_Channel from '../../../../components/ChatInvididual/Direct_Channel.svelte';
	import GroupChannel from '../../../../components/ChatGroup/Group_Channel.svelte';
	import AddGroupChannel from '../../../../components/ChatGroup/Add_Group_Channel.svelte';

	let showDirect = false;
	let showGroup = false;
	let showAddGroup = false;
	showComponent('Group');

	function showComponent(component: string): void {
		showDirect = component === 'Direct';
		showGroup = component === 'Group';
		showAddGroup = component === 'AddGroup';
	}

	// console.log("La puta vida tete",$userList)
	// console.log("Mi puto user tete",$currentUser)
</script>

<div class="card grid">
	<button class="grid-item {showDirect ? 'active' : ''} " on:click={() => showComponent('Direct')}
		>Mensajes Directos</button
	>
	<button class="grid-item {showGroup ? 'active' : ''} " on:click={() => showComponent('Group')}
		>Mis Canales</button
	>
	<button
		class="grid-item {showAddGroup ? 'active' : ''} "
		on:click={() => showComponent('AddGroup')}>Añadir Canales</button
	>
</div>
<div class="chat-container">
	{#if showDirect}
		<Direct_Channel />
	{/if}

	{#if showGroup}
		<GroupChannel />
	{/if}

	{#if showAddGroup}
		<AddGroupChannel />
	{/if}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		grid-gap: 10px;
	}

	.grid-item {
		padding: 8px;
		border: 1px solid #480e46;
		background-color: #480e46;
		cursor: pointer;
	}

	.chat-container {
		display: grid;
		grid-gap: 10px;
	}

	.active {
		background-color: lightyellow;
		color: black;
	}
</style>
