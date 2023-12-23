<script lang="ts">
	import { userList } from '../../../../store/User';
	import { currentUser } from '../../../../store/Auth';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="table-container">
		<!-- Native Table Element -->
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Avatar</th>
					<th>Nickname</th>
					<th>Ranking</th>
				</tr>
			</thead>
			<tbody>
				{#each [...$userList].sort((user1, user2) => {
					return user2.rank - user1.rank;
				}) as row}
					<tr class={$currentUser.id === row.id ? 'text-red-500' : ''}>
						<td><img src={row.avatar} alt="avatar" class="h-10" /></td>
						<td>{row.nickname}</td>
						<td>{row.rank != -1 ? row.rank : 'Unranked'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="postcss">
</style>
