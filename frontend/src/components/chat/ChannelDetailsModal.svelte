<script lang="ts">
	import { Tab, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import { channelList, kickUserFromChannel, updateChannel } from '../../store/Chat';
	import type { ChannelsChat } from '$lib/types';
	import { faEdit, faLock } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import ChatAvatar from './ChatAvatar.svelte';

	let modalStore = getModalStore();

	export let parent: SvelteComponent;

	let channel = $channelList.find((c) => c.id === $modalStore[0]?.meta?.id);
	let channelCopy = {
		name: channel.name,
		description: channel.description,
		password: ''
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
							<div class="grid grid-cols-[auto_auto_1fr] gap-2 items-center">
								<ChatAvatar {user} width="w-10" />
								<span>{user.nickname}</span>
								<div class="flex justify-end items-center space-x-2">
									{#if channelList.iOwn(channel.id) && !channelList.iAdmin(user.id)}
										<button
											class="btn variant-soft"
											on:click={() => {
												kickUserFromChannel(channel.id, user.id).then(() => {
													modalStore.close();
												});
											}}
										>
											Kick
										</button>
										<button class="btn variant-soft">Ban</button>
										<button class="btn variant-soft">Promote</button>
										<button class="btn variant-soft">Mute</button>
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
