<script lang="ts">
	import { Avatar, ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	// Global stores
	import type { Channel } from '$lib/types';
	import { chat_receptor, chat_history } from '../../store/Chat';
	import { unjoined_channels, invitations_channels } from '../../store/Chat';
	import { Api } from '$services/api';

	let channels: Channel[] = [];

	let displayAddChannel = false;
	let displayAvailableChannels = true;
	let displayPassworReq = false;
	let displayInvitations = false;
	let chatText = 'Create Channels';
	let buttonText = 'See Invites';

	$: {
		channels = [...$unjoined_channels.filter((channel: Channel) => channel.type !== 'Private')];
	}

	// When DOM mounted, scroll to bottom
	onMount(async () => {
		channels = [...$unjoined_channels.filter((channel: Channel) => channel.type !== 'Private')];
	});

	function filterChannel(keyword: string): void {
		if (!keyword) {
			channels = [...$unjoined_channels.filter((channel: Channel) => channel.type !== 'Private')];
		} else {
			channels = $unjoined_channels.filter((channel) => {
				const isNameMatch = channel.nickname.toLowerCase().includes(keyword.toLowerCase());
				const isNotPrivate = channel.type !== 'Private';
				return isNameMatch && isNotPrivate;
			});
		}
	}

	function join_channel(channel: Channel, password: string) {
		chat_receptor.set(channel);
		chat_history.set($chat_receptor.messages);

		if (channel.type === 'Protected') {
			if (password === '') {
				alert('Debes introducir una contraseña para el canal');
				return;
			}
		}

		let check_Channel = {
			id: $chat_receptor.id,
			type: $chat_receptor.type,
			password: password
		};
		console.log('Peticion para unirme al canal -> ', check_Channel);
		Api.post('/chat/join_channel/', check_Channel)
			.then((response) => {
				if (!response) alert('Error al unirse al canal');
			})
			.catch((error) => {
				console.error('Error al unirme al canal', error);
			});

		writtpsw = '';
	}

	function acept_invite(channel: Channel) {
		chat_receptor.set(channel);
		chat_history.set($chat_receptor.messages);
		let check_Channel = {
			id: $chat_receptor.id,
			type: $chat_receptor.type,
			password: $chat_receptor.password
		};
		Api.post('/chat/accept_invite_channel/', check_Channel)
			.then((response) => {
				console.log('Invitacion aceptada con éxito', response.data);
			})
			.catch((error) => {
				console.error('Error al crear aceptar la invitacion', error);
			});
	}

	function toogleAdd_Join() {
		if (chatText == 'Create Channels') {
			chatText = 'See Invites / Avialable Channels';
			displayAddChannel = true;
			displayAvailableChannels = false;
		} else if (chatText == 'See Invites / Avialable Channels') {
			chatText = 'Create Channels';
			displayAddChannel = false;
			displayAvailableChannels = true;
		}
	}

	const EnumOptions = {
		Private: 'Private',
		Public: 'Public',
		Protected: 'Protected'
	};

	let nombreCanal = '';
	let descripcionCanal = '';
	let selectedOption = 'Private';
	let writtpsw = '';

	function handleSelection(event: any) {
		selectedOption = event.target.value;
		console.log('Selected option -> ', selectedOption);
		displayPassworReq = selectedOption === 'Protected' ? true : false;
	}

	function crearCanal() {
		// Luego puedes reiniciar los valores o cambiar el estado para ocultar el formulario.
		console.log('buscamos form');
		if (selectedOption === 'Protected' && writtpsw === '') {
			alert('Debes introducir una contraseña para el canal');
			return;
		} else if (selectedOption !== 'Protected' && writtpsw !== '') {
			writtpsw = '';
		}
		let newChannel = {
			nickname: nombreCanal,
			description: descripcionCanal,
			type: selectedOption,
			password: writtpsw
		};

		Api.post('/chat/channel', newChannel)
			.then((response) => {
				console.log('Canal creado con éxito', response.data);
				toogleAdd_Join();
			})
			.catch((error) => {
				console.error('Error al crear el canal', error);
			});

		displayPassworReq = false;
		nombreCanal = '';
		descripcionCanal = '';
		selectedOption = 'Private';
		writtpsw = '';
	}
</script>

<div class="card chat-card">
	<div class="border-b border-surface-500/30 p-4">
		<button
			class="btn variant-ghost-surface"
			on:click={() => {
				toogleAdd_Join();
			}}>{chatText}</button
		>
		{#if !displayAddChannel}
			<button
				class="btn variant-ghost-surface"
				on:click={() => {
					if (displayInvitations === true) {
						buttonText = 'See Invites';
						displayInvitations = false;
					} else {
						displayInvitations = true;
						buttonText = 'See Avialable Channels';
					}
					// displayInvitations = displayInvitations === true ? false : true;
				}}>{buttonText}</button
			>
		{/if}
	</div>
	{#if displayAddChannel}
		<div class="create-channel-form">
			<form on:submit|preventDefault={crearCanal}>
				<label class="label">
					<span>Channel name</span>
					<input class="input" type="text" placeholder="Channel name" bind:value={nombreCanal} />
				</label>
				<label class="label">
					<span>Description</span>
					<textarea
						class="textarea"
						rows="4"
						placeholder="A brief description of the channel."
						bind:value={descripcionCanal}
					/>
				</label>
				<select class="select" on:change={handleSelection}>
					{#each Object.entries(EnumOptions) as [key, value]}
						<option value={key}>{value}</option>
					{/each}
				</select>
				{#if displayPassworReq}
					<label class="label">
						<span>Password</span>
						<input class="input" bind:value={writtpsw} type="password" placeholder="Password" />
					</label>
				{/if}
				<button class="btn variant-ghost-surface" type="submit">Create Channel</button>
			</form>
		</div>
	{/if}
	{#if displayAvailableChannels}
		<div class="list_channel">
			<div class="border-b border-surface-500/30 p-4">
				<input
					class="input"
					type="search"
					placeholder="Search..."
					on:input={(e) => filterChannel(e.target.value)}
				/>
			</div>
			{#if displayInvitations}
				<div class="user-list-container p-4 space-y-4 overflow-y-auto">
					<p>Invitations</p>
					<ListBox bind:group={$chat_receptor} name="people">
						{#each $invitations_channels as channel}
							<ListBoxItem bind:group={$chat_receptor} name="people" value={channel}>
								<div class="list-item">
									<div class="channel-info">
										<p class="channel-name">{channel.nickname}</p>
										<p class="channel-description">{channel.description}</p>
										<p class="channel-type">{channel.type} Channel</p>
									</div>
									<button
										class="btn variant-ghost-surface"
										on:click={() => {
											acept_invite(channel);
										}}
										>Join
									</button>
								</div>
							</ListBoxItem>
						{/each}
					</ListBox>
				</div>
			{/if}
			{#if !displayInvitations}
				<div class="user-list-container p-4 space-y-4 overflow-y-auto">
					<p>Avialable Channels</p>
					<ListBox bind:group={$chat_receptor} name="people">
						{#each channels as channel}
							<ListBoxItem bind:group={$chat_receptor} name="people" value={channel}>
								<div class="list-item">
									<div class="channel-info">
										<p class="channel-name">{channel.nickname}</p>
										<p class="channel-description">{channel.description}</p>
										<p class="channel-type">{channel.type} Channel</p>
										{#if channel.type === 'Protected'}
											<input
												class="input"
												bind:value={writtpsw}
												type="password"
												placeholder="Password"
											/>
										{/if}
									</div>
									<button
										class="btn variant-ghost-surface"
										on:click={() => {
											join_channel(channel, writtpsw);
										}}
										>Join
									</button>
								</div>
							</ListBoxItem>
						{/each}
					</ListBox>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* @import './chat.css'; */

	.chat-card {
		/* z-index: 4; */
		position: fixed;
		height: 100vh;
		width: 94vw;
	}

	.wrapper {
		display: grid;
		/* grid-template-columns: repeat(3, 1fr); */
		grid-template-columns: 30% 60% auto;
		grid-template-areas:
			'a b b'
			'a b b';
	}

	.list_channel {
		grid-area: a;
		border-right: 1px solid rgba(151, 151, 151, 0.2);
		/* background-color: red; */
	}

	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.channel-info {
		display: flex;
		flex: 1;
		flex-direction: row;
		gap: 10px;
	}

	.channel-name {
		font-weight: bold;
	}

	.channel-description {
		margin-top: 4px;
		color: #666;
	}

	.channel-type {
		margin-top: 4px;
		font-style: italic;
		color: #888;
	}
</style>
