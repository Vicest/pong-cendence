<script lang="ts">
	import { Tab, TabAnchor, TabGroup, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import {
		channelList,
		kickUserFromChannel,
		banUserFromChannel,
		updateChannel,
		unBanUserFromChannel,
		unAdminUserFromChannel,
		adminUserFromChannel,
		unMuteUserFromChannel,
		muteUserFromChannel
	} from '../../store/Chat';
	import type { ChannelsChat, Person } from '$lib/types';
	import { faEdit, faLock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import ChatAvatar from './ChatAvatar.svelte';
	import { currentUser } from '../../store/Auth';
	import { userList } from '../../store/User';

	const chatMuteIntervalModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Enter Time',
		body: 'Please enter the time for this mute. (in minutes)',
		// Populates the input value and attributes
		value: '',
		valueAttr: { type: 'number', min: 0, required: true },
		// Returns the updated response value
		response: (r: string) => {
			muteUserFromChannel(channel.id, selectedMuteUser.id, r !== '' ? parseInt(r) : 0);
			return r;
		}
	};

	let selectedMuteUser: Person;

	let modalStore = getModalStore();

	let channel = $channelList.find((c) => c.id === $modalStore[0]?.meta?.id) as ChannelsChat;
	let channelCopy = {
		name: channel.name,
		description: channel.description,
		password: ''
	};
	$: findUser = (id: number) => {
		return $userList.find((user) => user.id === id) as Person;
	};

	let tabSet: string = channelList.iOwn(channel.id) ? 'tab1' : 'tab2';
</script>

{#if channel}
	<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
		<TabGroup justify="justify-center">
			{#if channelList.iOwn(channel.id)}
				<Tab bind:group={tabSet} name="tab1" value={'tab1'}>
					<span>Edit</span>
				</Tab>
			{/if}
			<Tab bind:group={tabSet} name="tab2" value={'tab2'}>
				<span>Members</span>
			</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if channelList.iOwn(channel.id) && tabSet === 'tab1'}
					<div class="grid grid-cols-[auto_1fr] gap-4">
						<div class="space-y-2">
							<label class="label" for="name">Name</label>
							<input
								class="input"
								type="text"
								id="name"
								placeholder="Channel name"
								bind:value={channelCopy.name}
							/>
						</div>
						<div class="space-y-2">
							<label class="label" for="password">Password</label>
							<div class="input-group grid-cols-[1fr_auto] items-center">
								<input
									type="password"
									id="password"
									placeholder="Password (optional)"
									bind:value={channelCopy.password}
									class="input"
								/>
								<Fa icon={faLock} class="input-group-shim text-surface-500/50 pr-2" />
							</div>
						</div>
					</div>
					<div class="space-y-2">
						<label class="label" for="description">Description</label>
						<textarea
							class="input"
							id="description"
							rows="4"
							placeholder="Channel description (optional)"
							bind:value={channelCopy.description}
						/>
					</div>
					<div class="flex justify-end items-center space-x-2 mt-2">
						<button
							class="btn variant-soft"
							on:click={() => {
								modalStore.close();
							}}
						>
							Cancel
						</button>
						<button
							class="btn variant-filled"
							on:click={() => {
								updateChannel(channel.id, channelCopy).then(() => {
									modalStore.close();
								});
							}}
						>
							Save
						</button>
					</div>
				{:else if tabSet === 'tab2'}
					<div class="grid gap-2">
						{#each channel.users as user}
							<div class="grid grid-cols-[auto_auto_auto_1fr] gap-2 items-center">
								<ChatAvatar user={findUser(user.id)} width="w-10" />
								<span>{findUser(user.id).nickname}</span>
								<small class="text-surface-500/50"
									>{channelList.isAdmin(channel.id, user.id)
										? channelList.isOwner(channel.id, user.id)
											? 'Owner'
											: 'Admin'
										: ''}</small
								>
								<div class="flex justify-end items-center space-x-2">
									{#if channelList.iAdmin(channel.id) && user.id !== $currentUser.id && !channelList.isOwner(channel.id, user.id)}
										<button
											class="btn variant-soft"
											on:click={() => {
												kickUserFromChannel(channel.id, user.id).then(() => {
													modalStore.close();
												});
											}}
											disabled={channelList.isBanned(channel.id, user.id)}
										>
											Kick
										</button>
										{#if channelList.isBanned(channel.id, user.id) && channelList.iOwn(channel.id)}
											<button
												class="btn variant-soft"
												on:click={() => {
													unBanUserFromChannel(channel.id, user.id).then(() => {
														modalStore.close();
													});
												}}
											>
												Unban
											</button>
										{:else if !channelList.isBanned(channel.id, user.id) && channelList.iOwn(channel.id)}
											<button
												class="btn variant-soft"
												on:click={() => {
													banUserFromChannel(channel.id, user.id).then(() => {
														modalStore.close();
													});
												}}
											>
												Ban
											</button>
										{/if}
										{#if channelList.isAdmin(channel.id, user.id) && channelList.iOwn(channel.id)}
											<button
												class="btn variant-soft"
												on:click={() => {
													unAdminUserFromChannel(channel.id, user.id).then(() => {
														modalStore.close();
													});
												}}
											>
												Unpromote
											</button>
										{:else if !channelList.isAdmin(channel.id, user.id) && channelList.iOwn(channel.id)}
											<button
												class="btn variant-soft"
												on:click={() => {
													adminUserFromChannel(channel.id, user.id).then(() => {
														modalStore.close();
													});
												}}
											>
												Promote
											</button>
										{/if}
										{#if channelList.isMuted(channel.id, user.id)}
											<button
												class="btn variant-soft"
												on:click={() => {
													unMuteUserFromChannel(channel.id, user.id).then(() => {
														modalStore.close();
													});
												}}
											>
												Unmute
											</button>
										{:else if !channelList.isMuted(channel.id, user.id)}
											<button
												class="btn variant-soft"
												on:click={() => {
													selectedMuteUser = user;
													modalStore.close();
													modalStore.trigger(chatMuteIntervalModal);
												}}
											>
												Mute
											</button>
										{/if}
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</svelte:fragment>
		</TabGroup>
	</div>
{/if}
