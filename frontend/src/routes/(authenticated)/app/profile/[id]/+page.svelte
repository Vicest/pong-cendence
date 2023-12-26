<script lang="ts">
	import { page } from '$app/stores';
	import { userList } from '../../../../../store/User';
	import { get } from 'svelte/store';
	import { Avatar } from '@skeletonlabs/skeleton';

	$: profilePerson = get(userList).find((person) => {
		return person.id.toString() === $page.params.id;
	});
</script>

<div class="h-full grid gap-4 p-4 lg:grid-cols-[4fr,1fr] lg:grid-rows-[1fr] grid-rows-[2fr,1fr]">
	{#if profilePerson === undefined}
		No such profile :sadge:
	{:else}
		<div class="container h-full mx-auto flex flex-col items-center">
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				<div class="flex justify-center items-center w-full">
					<div class="line" />
					<div class="relative">
						<Avatar
							src={profilePerson.avatar}
							width="w-40"
							class="border-4 border-white rounded-full opacity-50"
						/>
						<label for="profile-avatar" class="profile-avatar-label" />
					</div>
					<div class="line" />
				</div>
				<div>{profilePerson.nickname}: {profilePerson.status}</div>
			</div>
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				Rank: {profilePerson.rank}
			</div>
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				<div class="text-center font-bold mb-4">PLAY</div>
				<div class="flex flex-row justify-center items-center">
					<!-- I know I should not hardcode the 0 and 1 for games ids, but it is what it is -->
					<button type="button" class="btn btn-sm variant-filled">classic</button>
					<button type="button" class="btn btn-sm variant-filled">boundless</button>
				</div>
				<!--
				<button
					type="button"
					class="btn btn-sm variant-filled"
					on:click={() => /*sendChallenge(channel.user.id, 1, findUser(channel.user.id).nickname)*/}
					>VS boundless</button
				>
				-->
			</div>
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				Matches played
			</div>
		</div>
	{/if}
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
