<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { currentUser } from '../../../../store/Auth';
	import { banUser, unbanUser, userList } from '../../../../store/User';
	import { channelList, sendDeleteChanneldRequest } from '../../../../store/Chat';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let toastStore = getToastStore();
	let loaded = false;
	onMount(() => {
		if (!$currentUser.isAdmin) {
			goto('/app');
		} else {
			loaded = true;
		}
	});
</script>

{#if loaded}
	<div
		class="container h-full w-full grid gap-4 lg:grid-cols-[1fr_1fr] lg:grid-rows-[1fr] mx-auto align-middle justify-center items-center text-center"
	>
		<div class="table-container">
			<!-- Native Table Element -->
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Avatar</th>
						<th>Nickname</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each $userList.filter((user) => user.id !== $currentUser.id) as row}
						<tr class={`cursor-pointer ${$currentUser.id === row.id ? 'text-red-500' : ''}`}>
							<td><img src={row.avatar} alt="avatar" class="h-10" /></td>
							<td>{row.nickname}</td>
							<td>
								{#if userList.isBanned(row.id)}
									<button
										type="button"
										class="btn variant-filled-primary"
										on:click={() => {
											unbanUser(row.id).then(() => {
												toastStore.trigger({
													message: `User ${row.nickname} has been unbanned`
												});
											});
										}}>Unban</button
									>
								{:else if !userList.isBanned(row.id)}
									<button
										type="button"
										class="btn variant-filled-error"
										on:click={() => {
											banUser(row.id).then(() => {
												toastStore.trigger({
													message: `User ${row.nickname} has been banned`
												});
											});
										}}>Ban</button
									>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div>
			<!-- Native Table Element -->
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Channel</th>
						<th>Users</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each $channelList.filter((channel) => channel.type == 'Channel') as row}
						<tr class="cursor-pointer">
							<td>{row.name}</td>
							<td>{row.users.length}</td>
							<td>
								<button
									type="button"
									class="btn variant-filled-error"
									on:click={() => {
										sendDeleteChanneldRequest(row.id).then(() => {
											toastStore.trigger({
												message: `Channel ${row.name} has been deleted`
											});
										});
									}}>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style scoped>
</style>
