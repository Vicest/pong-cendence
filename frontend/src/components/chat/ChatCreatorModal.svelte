<script lang="ts">
	import {
		ListBox,
		ListBoxItem,
		RadioGroup,
		RadioItem,
		SlideToggle,
		Step,
		Stepper
	} from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import ChatAvatar from './ChatAvatar.svelte';
	import Fa from 'svelte-fa';
	import { faLock } from '@fortawesome/free-solid-svg-icons';
	import { channelList } from '../../store/Chat';
	import { userList } from '../../store/User';
	import type { Person } from '$lib/types';
	import { sendCreateChanneldRequest } from '../../store/Chat';
	import { HttpStatusCode } from 'axios';
	import { goto } from '$app/navigation';

	export let parent: SvelteComponent;

	let chatForm = {
		name: '',
		password: '',
		description: '',
		accepted: false
	};

	let filteredUsers: Person[] = [];

	let keyword = '';
	let selected: Person[] = [];

	$: {
		filteredUsers = userList.getMyFriends().filter((user) => {
			console.log('user', user);
			return user.nickname.toLowerCase().includes(keyword.toLowerCase());
		});
	}

	function onNextHandler(e: CustomEvent): void {
		console.log('event:next', e.detail);
	}
	function onBackHandler(e: CustomEvent): void {
		console.log('event:prev', e.detail);
	}
	function onStepHandler(e: CustomEvent): void {
		console.log('event:step', e.detail);
	}
	function onCompleteHandler(e: CustomEvent): void {
		console.log('event:complete', e.detail);
		sendCreateChanneldRequest({
			name: chatForm.name,
			description: chatForm.description,
			password: chatForm.password,
			users: selected
		})
			.then((res) => {
				parent.onClose();
				if (res.status === HttpStatusCode.Created) {
					goto(`/app/chat/${res.data.id}`);
				}
			})
			.catch((err) => console.log(err));
	}
</script>

<div class="modal-example-form card p-4 w-modal shadow-xl space-y-4">
	<Stepper
		on:next={onNextHandler}
		on:back={onBackHandler}
		on:step={onStepHandler}
		on:complete={onCompleteHandler}
	>
		<Step>
			<svelte:fragment slot="header">Channel details</svelte:fragment>
			<p>Enter a name and description for your channel. This is the first step in the process.</p>
			<div class="grid gap-4 lg:grid-cols-[auto_1fr_auto] grid-cols-1">
				<div class="space-y-2">
					<label class="label" for="name">Name</label>
					<input
						class="input"
						type="text"
						id="name"
						placeholder="Channel name"
						bind:value={chatForm.name}
					/>
				</div>
				<div class="space-y-2">
					<label class="label" for="password">Password</label>
					<div class="input-group grid-cols-[1fr_auto] items-center">
						<input
							type="password"
							id="password"
							placeholder="Password (optional)"
							bind:value={chatForm.password}
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
					bind:value={chatForm.description}
				/>
			</div>
		</Step>
		<Step>
			<svelte:fragment slot="header">Invite members</svelte:fragment>
			<p>Invite members to your channel. You can invite as many members as you like.</p>
			<input class="input" type="search" placeholder="Search..." bind:value={keyword} />
			<ListBox
				class="border border-surface-500 p-4 rounded-container-token overflow-y-auto max-h-[30vh]"
				multiple
				active="variant-filled-primary"
			>
				{#each filteredUsers as user}
					<ListBoxItem bind:group={selected} name="people" value={user.id}>
						<div class="flex items-center space-x-4">
							<ChatAvatar {user} width="w-10" />
							<span>
								{user.nickname}
							</span>
						</div>
					</ListBoxItem>
				{/each}
				{#if filteredUsers.length === 0}
					<div class="flex justify-center items-center">
						<span class="text-gray-400">No friends found</span>
					</div>
				{/if}
			</ListBox>
		</Step>
		<Step locked={!chatForm.accepted}>
			<svelte:fragment slot="header">A Locked Step.</svelte:fragment>
			<p>
				I accept the terms and conditions of this service. I understand that I am responsible for
				any content I post to this service. I understand that this service is not a secure means of
				communication and that I should not post sensitive or personal information to this service.
			</p>
			<aside class="alert variant-ghost-secondary">
				<div class="alert-message">
					<p>I accept the terms and conditions of this service.</p>
				</div>
				<div class="alert-actions">
					<SlideToggle
						name="locked-state"
						bind:checked={chatForm.accepted}
						active="bg-warning-500"
					/>
				</div>
			</aside>
		</Step>
	</Stepper>
</div>
