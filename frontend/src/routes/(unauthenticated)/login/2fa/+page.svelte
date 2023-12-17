<!-- Login Page -->
<script>
	import { goto } from '$app/navigation';
	import { Api } from '$services/api';

	let token = '';

	function save2FAChanges() {
		Api.post('/auth/2FAcheck', {
			token
		})
			.then((res) => {
				if (res.status === 200) {
					goto('/app');
				} else {
					token = '';
				}
			})
			.catch((err) => {
				token = '';
			});
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="flex flex-col justify-center items-center my-10 card w-full p-10">
		<div class="flex flex-col justify-center items-center mt-4">
			<label class="label">
				<span class="text-2xl font-bold">2FA</span>
				<input
					class="input"
					type="text"
					placeholder="Input"
					bind:value={token}
					on:keydown={(e) => {
						if (e.key === 'Enter') save2FAChanges();
					}}
				/>
				<button class="btn btn-primary mt-2" on:click={save2FAChanges}>Save</button>
			</label>
		</div>
	</div>
</div>
