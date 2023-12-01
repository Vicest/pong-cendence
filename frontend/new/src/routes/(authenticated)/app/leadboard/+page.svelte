<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	// Global stores
	import { mock_user_list , mock_user } from "../../../../store/MOCK";
	
	let user_list : any;
	let user : any;
	let leaderboards : any[] = [];
	let userPositionLeader : number = 0;
	let topFive : any[] = [];
	let sorroundme : any[] = [];

	
	mock_user.subscribe((value) => {
		user = value;
    });
	
	mock_user_list.subscribe((value) => {
		user_list = value;
		console.log("User list -> ", user_list);
	});
	
	function calculateLeaderboards() {
		// NECESITA ORDENAR POR ELO PERO COMO NO TENGO LO HAGO POR ID
		leaderboards.sort((a: any, b: any) => b.id - a.id);
		topFive = leaderboards.slice(0, 5);
		
        userPositionLeader = topFive.findIndex((u: any) => u.id === user.id);
		topFive = leaderboards;
		if (leaderboards.length >= 5)
		topFive = leaderboards.slice(0, 5);
		

		const userIndex = leaderboards.findIndex((u: any) => u.nickname === user.nickname);
		if (userIndex > -1) {
			sorroundme = leaderboards.slice(userIndex - 2, userIndex + 2);
		}
	}

    // Llamar a la función cuando la lista de usuarios cambie
    $: {
		leaderboards = user_list.concat(user);
		calculateLeaderboards();
    }

	onMount(() => {
		
		calculateLeaderboards();
		// console.log("Contructing leaderboard ->  ", user_list);
		// console.log("Contructing leaderboard ->  ", user)
		// console.log("Contructing leaderboard ->  ", topFive);
		// console.log("Contructing leaderboard ->  ", beforeMeList);
		// console.log("Contructing leaderboard ->  ", afterMeList);
    });

    // Esta función garantiza que la lista se ordene al destruir el componente
    onDestroy(() => {
		console.log("Destroying leaderboard");
        calculateLeaderboards();
    });


</script>

<div class="container h-full mx-auto flex justify-center items-center">
    <div class="space-y-10 text-center flex flex-col items-center">
        <h2 class="h2">Los Jugones</h2>

        <table class="table-auto border-collapse border border-solid">
            <thead>
                <tr>
                    <th class="border border-solid px-2 py-2">Position</th>
                    <th class="border border-solid px-2 py-2">Player</th>
                    <th class="border border-solid px-2 py-2">Score</th>
                </tr>
            </thead>
            <tbody>
				{#each topFive as u, index}
					<tr>
						<td class="border border-solid px-2 py-2">{index + 1}</td>
						{#if u.id === user.id}
							<td class="border border-solid px-2 py-2 variant-filled-primary">{u.nickname}</td>
						{:else}
							<td class="border border-solid px-2 py-2">{u.nickname}</td>
						{/if}
						<td class="border border-solid px-2 py-2">{u.id}</td>
					</tr>
				{/each}
			</tbody>
        </table>
		{#if sorroundme.length > 0}
			<h3>Mi posicion</h3>
			<table class="table-auto border-collapse border border-solid">
				<thead>
					<tr>
						<th class="border border-solid px-2 py-2">Position</th>
						<th class="border border-solid px-2 py-2">Player</th>
						<th class="border border-solid px-2 py-2">Score</th>
					</tr>
				</thead>
				<tbody>
					{#each sorroundme as u}
						<tr>
							<td class="border border-solid px-2 py-2">{leaderboards.indexOf(u) + 1}</td>
							{#if u.id === user.id}
								<td class="border border-solid px-2 py-2 variant-filled-primary">{u.nickname}</td>
							{:else}
								<td class="border border-solid px-2 py-2">{u.nickname}</td>
							{/if}
							<td class="border border-solid px-2 py-2">{u.id}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
