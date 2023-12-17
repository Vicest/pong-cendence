<script lang="ts">
	import { currentUser } from '../../../../store/Auth';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { faEdit } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { Api } from '$services/api';

	// Create a copy of the current user to edit
	let currentUserCopy = { ...$currentUser };

	let editMode: boolean = false;
	let encodedImg: string;
	let imageFile : any;

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
	// Save the changes
	async function saveChanges() {
		
		let updateinfo = {
			nickname: currentUserCopy.nickname
		};
		if (encodedImg) updateinfo.avatar = encodedImg;

		try {
			const res = await Api.put('/users', updateinfo)
			// const res = await Api.request({
			// 	url: '/users',
			// 	method: 'PUT',
			// 	headers: {
			// 		'Content-Type': 'multipart/form-data'
			// 	},
			// 	data: {
			// 		...updateinfo,
			// 	}
			// });
			if (res.status === 200) {
				editMode = false;
			} else {
				console.log(res);
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	}
</script>

<div class="container h-full mx-auto flex flex-col items-center">
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex justify-center items-center w-full">
			<div class="line" />
			<div class="relative">

				<Avatar
					src={encodedImg ?? currentUserCopy.avatar}
					width="w-40"
					class="border-4 border-white rounded-full opacity-50"
				/>
				{#if !editMode}
					<Fa icon={faEdit} class="text-5xl absolute w-full h-full z-10 top-12 text-black opacity-100 text-white" />
				{/if}
				<label for="profile-avatar" class="profile-avatar-label" />
			</div>
			<div class="line" />
		</div>
		{#if !editMode}
			<div class="flex gap-5 justify-center items-center mt-4 relative">
				<span class="text-2xl font-bold">{$currentUser.nickname}</span>
				<div class="ml-2 cursor-pointer" on:click={() => (editMode = !editMode)}>
					<Fa icon={faEdit} class="text-2xl" />
				</div>
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

	.profile-avatar-edit {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 10000;
	}
</style>
