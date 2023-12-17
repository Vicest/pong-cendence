<script lang="ts">
	import { currentUser } from '../../../../store/Auth';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { faEdit } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { Api } from '$services/api';

	// Create a copy of the current user to edit
	let currentUserCopy = { ...$currentUser };

	let editMode: boolean = false;

	let edit2FAMode: boolean = false;

	// Save the changes
	async function saveChanges() {
		Api.put('/users', {
			nickname: currentUserCopy.nickname
		}).then((res) => {
			if (res.status === 200) {
				editMode = false;
			}
		});
	}

	let edit2FABase64Qr: string | null = null;
	async function get2FAData() {
		if (edit2FAMode) {
			return;
		}
		Api.get('/auth/2FA').then((res) => {
			edit2FABase64Qr = res.data;
			console.log(edit2FABase64Qr);
		});
		edit2FAMode = true;
	}

	async function save2FAChanges() {
		console.log('save2FAChanges');
	}
</script>

<div class="container h-full mx-auto flex flex-col items-center">
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex justify-center items-center w-full">
			<div class="line" />
			<Avatar src={$currentUser.avatar} width="w-60" class="border-4 border-white rounded-full" />
			<div class="line" />
		</div>
		<div class="flex gap-5 justify-center items-center mt-4 relative">
			<span class="text-2xl font-bold">{$currentUser.nickname}</span>
			<div class="ml-2 cursor-pointer" on:click={() => (editMode = !editMode)}>
				<Fa icon={faEdit} class="text-2xl" />
			</div>
		</div>
		{#if editMode}
			<div class="flex flex-col justify-center items-center mt-4">
				<label class="label">
					<span>Nickname</span>
					<input
						class="input"
						type="text"
						placeholder="Input"
						bind:value={currentUserCopy.nickname}
						on:keydown={(e) => {
							if (e.key === 'Enter') saveChanges();
						}}
					/>
					<button class="btn btn-primary mt-2" on:click={saveChanges}>Save</button>
				</label>
			</div>
		{/if}
	</div>
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex gap-5 justify-center items-center mt-4 relative">
			<span class="text-2xl font-bold">2FA</span>
			<div class="ml-2 cursor-pointer" on:click={get2FAData}>
				<Fa icon={faEdit} class="text-2xl" />
			</div>
		</div>
		{#if edit2FAMode}
			<div class="flex flex-col justify-center items-center mt-4">
				<label class="label">
					<span class="text-2xl font-bold 2fa-label">2FA</span>
					<img src={edit2FABase64Qr} alt="2FA QR Code" />
					<button class="btn btn-primary mt-2" on:click={save2FAChanges}>Save</button>
				</label>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.line {
		border: 1px solid #fff;
		width: 100%;
		margin: 0 10px;
	}
</style>
