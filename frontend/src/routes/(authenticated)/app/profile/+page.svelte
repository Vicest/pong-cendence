<script lang="ts">
	import { currentUser } from '../../../../store/Auth';
	import { Avatar, SlideToggle } from '@skeletonlabs/skeleton';
	import { faEdit } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { Api } from '$services/api';

	// Create a copy of the current user to edit
	let currentUserCopy = { ...$currentUser };
	let editMode: boolean = false;
	let encodedImg: string;
	let imageFile: any;
	let twofaCode: string;
	let value: boolean = currentUserCopy.two_factor_auth_enabled;
	const handleFileChange = (event: any) => {
		imageFile = event.target.files[0];

		if (imageFile.size > 2097152) {
			alert('File too big! Max 2Mb');
			event.target.value = '';
		} else if (imageFile) {
			const reader = new FileReader();

			reader.onload = (e: any) => {
				encodedImg = e.target.result;
				editMode = true;
			};
			reader.readAsDataURL(imageFile);
		}
	};
	let edit2FAMode: boolean = false;

	// Save the changes
	async function saveChanges() {
		let updateinfo = {};
		if (encodedImg) updateinfo.avatar = encodedImg.replace(/^data:image\/(png|jpeg);base64,/, '');
		if ($currentUser.nickname != currentUserCopy.nickname)
			updateinfo.nickname = currentUserCopy.nickname;

		if (Object.keys(updateinfo).length > 0) {
			// TODO: multiparted image
			console.log(updateinfo);
			const res = await Api.put('/users', updateinfo);
			if (res.status === 200) {
				editMode = false;
			}
		}
	}
	let edit2FABase64Qr: string | null = null;
	async function get2FAData(e: any) {
		const target = e.target as SlideToggle;
		target.checked = $currentUser.two_factor_auth_enabled;
		if (edit2FAMode) {
			return;
		}
		Api.get('/auth/2FA').then((res) => {
			edit2FABase64Qr = res.data;
			console.log(edit2FABase64Qr);
		});
		edit2FAMode = true;
	}

	async function save2FAChanges(e: any) {
		const target = e.target as SlideToggle;
		if (!twofaCode) {
			alert('Please enter the code');
			return;
		}
		console.log(twofaCode);
		Api.post('/auth/2FAchange', {
			token: twofaCode
		}).then((res) => {
			twofaCode = '';
			if (res.status === 200) {
				value = !$currentUser.two_factor_auth_enabled;
				console.log('2fa status', currentUserCopy.two_factor_auth_enabled);
				edit2FAMode = false;
			}
		});
	}
	async function Changetogglestatus() {}
</script>

<div class="container h-full mx-auto flex flex-col items-center">
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex justify-center items-center w-full">
			<div class="line" />
			<div class="relative">
				<Avatar
					src={encodedImg || currentUserCopy.avatar}
					width="w-40"
					class="border-4 border-white rounded-full opacity-50"
				/>
				<Fa
					icon={faEdit}
					class="text-5xl absolute w-full h-full z-10 top-12 text-black opacity-100 text-white"
				/>
				<label for="profile-avatar" class="profile-avatar-label" />
			</div>
			<div class="line" />
		</div>
		{#if !editMode}
			<div class="flex gap-5 justify-center items-center mt-4 relative">
				<span class="text-2xl font-bold">{$currentUser.nickname}</span>
				<button class="ml-2 cursor-pointer" on:click={() => (editMode = !editMode)}>
					<Fa icon={faEdit} class="text-2xl" />
				</button>
			</div>
		{/if}
		<input
			class="input-avatar"
			id="profile-avatar"
			type="file"
			accept=".png, .jpeg, .jpg"
			on:change={handleFileChange}
		/>

		{#if editMode}
			<div class="flex flex-col justify-center items-cvariant-filledenter mt-4">
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
					<button class="btn variant-filled mt-2" on:click={saveChanges}>Save</button>
				</label>
			</div>
		{/if}
	</div>
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex gap-5 justify-center items-center mt-4 relative">
			<span class="text-2xl font-bold">2FA</span>
			<SlideToggle name="slide" on:click={get2FAData} bind:checked={value} />
		</div>
		{#if edit2FAMode}
			<div class="flex flex-col justify-center items-center mt-4">
				<label class="label">
					<span class="text-2xl font-bold 2fa-label">2FA</span>
					{#if $currentUser.two_factor_auth_enabled == false}
						<img src={edit2FABase64Qr} alt="2FA QR Code" />
					{/if}
					<input
						class="input"
						type="text"
						placeholder="Input"
						bind:value={twofaCode}
						on:keydown={(e) => {
							if (e.key === 'Enter') save2FAChanges();
						}}
					/>
					<button class="btn btn-primary mt-2" on:click={save2FAChanges}>Save</button>
				</label>
			</div>
		{/if}
	</div>
</div>

<style scoped>
	.line {
		border: 1px solid #fff;
		width: 100%;
		margin: 0 10px;
	}
	.input-avatar {
		display: none;
	}
	.profile-avatar-label {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;
		border-radius: 50%;
	}
	.profile-avatar-label:hover {
		background: rgba(255, 255, 255, 0.7);
		cursor: pointer;
	}
</style>
