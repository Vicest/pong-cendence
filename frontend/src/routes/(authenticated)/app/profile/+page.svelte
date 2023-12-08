<script lang="ts">
	import { currentUser } from '../../../../store/Auth';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { faEdit } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { Api } from '$services/api';
	import Cookies from 'js-cookie';

	// Create a copy of the current user to edit
	let currentUserCopy = { ...$currentUser };

	let editMode: boolean = false;

	let imageFile;

	const handleFileChange = (event: any) => {
		imageFile = event.target.files[0];
		if(imageFile.size > 2097152)
		{
       		alert("File too big! Max 2Mb");
			event.target.value ="";
		}
		else if (imageFile) {
			const reader = new FileReader();

			reader.onload = (e: any) => {
				const base64EncodedImage = e.target.result;
				console.log(base64EncodedImage);
				currentUserCopy.avatar = base64EncodedImage;
				editMode = true;
			};
			reader.readAsDataURL(imageFile);
		}
	};
	// Save the changes
	async function saveChanges() {
		Api.put('/users', {
			nickname: currentUserCopy.nickname,
			avatar: currentUserCopy.avatar
		}).then((res) => {
			if (res.status === 200) {
				editMode = false;
			}
		});
	}
</script>
<style lang="postcss">
	.line {
		border: 1px solid #fff;
		width: 100%;
		margin: 0 10px;
	}
	.input-avatar {
		display: none;
	}
	.profile-avatar-label:hover {
		background-color: rgb(128, 128, 128,0.9);
		border-radius: 60px;
		cursor: pointer;
	}

</style>


<div class="container h-full mx-auto flex flex-col items-center">
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex justify-center items-center w-full ">
			<div class="line" />
			<div class="xd">
			<label for="profile-avatar" class="profile-avatar-label">
				<Avatar src={$currentUser.avatar} width="w-40" class="border-4 border-white rounded-full" />
			</label>
		</div>
			<div class="line" />
		</div>
		<div class="flex gap-5 justify-center items-center mt-4 relative">
			<span class="text-2xl font-bold">{$currentUser.nickname}</span>
			<div class="ml-2 cursor-pointer" on:click={() => (editMode = !editMode)}>
				<Fa icon={faEdit} class="text-2xl" />
			</div>
		</div>
		<input class="input-avatar" id="profile-avatar" type="file" accept="image/*" on:change={handleFileChange} >
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

