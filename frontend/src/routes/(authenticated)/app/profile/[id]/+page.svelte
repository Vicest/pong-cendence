<script lang="ts">
	import { page } from '$app/stores';
	import { userList } from '../../../../../store/User';
	import { get } from 'svelte/store';
	import { Avatar, getToastStore } from '@skeletonlabs/skeleton';
	import { MatchMakingSocket } from '$services/socket';

	$: profilePerson = $userList.find((person) => {
		return person.id.toString() === $page.params.id;
	});

	$: findUser = (id: number) => {
		return $userList.find((user) => user.id === id) as Person;
	};

	$: matchHistory = profilePerson?.history.sort((a, b) => {
		return a.created_at - b.created_at;
	});

	//I know, not pretty, still functional
	let toastStore = getToastStore();
	function sendChallenge(
		targetId: number | undefined,
		gid: number,
		targetNick: string | undefined
	) {
		if (!targetId || !targetNick) return;
		MatchMakingSocket.emit('challenge', {
			opponentId: targetId,
			gameId: gid
		});
		toastStore.trigger({
			message: `You challenged ${targetNick}`
		});
	}
</script>

<div class="h-full grid gap-4 p-4 lg:grid-cols-[1fr] lg:grid-rows-[1fr] grid-rows-[2fr,1fr]">
	{#if profilePerson === undefined}
		<div class="text-center font-bold mb-4">No such profile :sadge:</div>
	{:else}
		<div class="container h-full mx-auto flex flex-col items-center">
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				<div class="flex justify-center items-center w-full">
					<div class="line" />
					<div class="relative">
						<Avatar
							src={profilePerson.avatar}
							width="w-40"
							class="border-4 border-white rounded-full"
						/>
						<label for="profile-avatar" class="profile-avatar-label" />
					</div>
					<div class="line" />
				</div>
				<div>{profilePerson.nickname}: {profilePerson.status}</div>
			</div>
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				Rank: {profilePerson.rank === -1 ? 'Unranked' : profilePerson.rank}
			</div>
			<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
				<div class="text-center font-bold mb-4">PLAY</div>
				<div class="flex flex-row justify-center items-center">
					<!-- I know I should not hardcode the 1 and 2 for games ids, but it is what it is -->
					<button
						type="button"
						class="btn variant-ghost-surface z-10"
						disabled={profilePerson?.status !== 'online'}
						on:click={() => sendChallenge(profilePerson?.id, 1, profilePerson?.nickname)}
						>classic</button
					>
					<button
						type="button"
						class="btn variant-ghost-surface z-10"
						disabled={profilePerson?.status !== 'online'}
						on:click={() => sendChallenge(profilePerson?.id, 2, profilePerson?.nickname)}
						>boundless</button
					>
				</div>
			</div>
			{#if matchHistory != undefined}
				<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
					<div class="text-center font-bold mb-4">MATCH HISTORY</div>
					{#each matchHistory as match}
						<div class="flex flex-row justify-center items-center my-10 card w-full p-10">
							{#if match.players[0].isWinner}
								{#if match.players[0].rankShift != 0}
									Elo shift: {match.players[0].rankShift}
								{:else}
									Unranked game
								{/if}
							{:else if match.players[1].rankShift != 0}
								Elo shift: {match.players[1].rankShift}
							{:else}
								Unranked game
							{/if}
							<!--Winner/Loser-->
							{#if match.players[0].isWinner}
								Winner
							{:else}
								Loser
							{/if}
							<Avatar
								src={findUser(match.players[0].user.id).avatar}
								width="w-10"
								class="border-4 border-white rounded-full"
							/>
							<div class="text-center font-bold mb-4">vs</div>
							<Avatar
								src={findUser(match.players[1].user.id).avatar}
								width="w-10"
								class="border-4 border-white rounded-full"
							/>
							{#if match.players[1].isWinner}
								Winner
							{:else}
								Loser
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style scoped>
	.line {
		border: 1px solid #fff;
		width: 100%;
		margin: 0 10px;
	}
	.profile-avatar-label {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 10000;
		border-radius: 50%;
	}
</style>
