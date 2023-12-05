<script lang="ts">
	import { currentUser } from "../../../../store/Auth";
	import type { PageData } from "./$types";
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
					<th>Is Admin</th>
					<th>ID</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as row}
					<tr class="{$currentUser.id === row.id ? 'text-red-500' : ''}">
						<td><img src={row.avatar} alt="avatar" class="h-10" /></td>
						<td>{row.nickname}</td>
						<td>{row.isAdmin}</td>
						<td>{row.id}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="postcss">
</style>
