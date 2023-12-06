<script lang="ts">
	import { currentUser } from "../../../../store/Auth";
	import { Avatar } from "@skeletonlabs/skeleton";
	import { faEdit } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { Api } from "$services/api";


	// Create a copy of the current user to edit
	let currentUserCopy = { ...$currentUser };

	let editMode: boolean = false;

	// Save the changes
	async function saveChanges() {
		Api.put("/users", currentUserCopy).then((res) => {
			if (res.status === 200) {
				editMode = false;
			}
		});
	};
</script>
<div class="container h-full mx-auto flex flex-col items-center">
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex justify-center items-center  w-full">
			<div class="line"></div>
			<Avatar src="{ $currentUser.avatar }" width="w-60" class="border-4 border-white rounded-full"></Avatar>
			<div class="line"></div>
		</div>
		<div class="flex gap-5 justify-center items-center mt-4 relative">
			<span class="text-2xl font-bold">{ $currentUser.nickname }</span>
			<div class="ml-2 cursor-pointer" on:click="{ () => editMode = !editMode }">
				<Fa icon="{ faEdit }" class="text-2xl"></Fa>
			</div>
		</div>
		{#if editMode}
			<div class="flex flex-col justify-center items-center mt-4">
				<label class="label">
					<span>Nickname</span>
					<input class="input" type="text" placeholder="Input" bind:value="{ currentUserCopy.nickname }" on:keydown={(e) => { if (e.key === 'Enter') saveChanges() } } />
				<button class="btn btn-primary mt-2" on:click="{ saveChanges }">Save</button>
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
