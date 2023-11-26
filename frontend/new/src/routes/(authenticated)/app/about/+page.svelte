<script lang="ts">
	import { userList, updateUser } from '../../../../store/User';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">About</h2>
		{#each $userList as user}
			<img src={user.avatar} alt="avatar" class="h-10" on:click={() => updateUser(user.id)} />
			<p>{user.nickname}</p>
		{/each}
	</div>
</div>

<style lang="postcss">
</style>
