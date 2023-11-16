<script lang="ts">
	import { userList, updateUser } from '../../../../store/User';
	import { io } from "socket.io-client";
	import { aux_socket } from '../../../../store/Socket';

	
	let connected = false;
	let User = {
		id: 0,
		nickname: 'Miguel',
		email: 'mortiz-d@gmail.com',
		avatar: 'El pingudo',
		two_factor_auth_secret: "wololo",
		two_factor_auth_enabled: false,
	}
	let Msg = {
		id: 0,
		content: "Que mierda es esta",
		sender: User,
		target: User,
		created_at: "2021-10-10 10:10:10"
	}


	aux_socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

	aux_socket.on('connect', () => {
		connected = true;
		console.log('Connected to server');
	});



	aux_socket.on('disconnect', () => {
		connected = false;
		console.log('Disconnected from server');
	});

	function sendmessage()
	{
		aux_socket.connect();
		aux_socket.emit('message', Msg);
		console.log('Mensaje enviado');
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">About</h2>
		<button on:click={() => { sendmessage() }}>Envia un mensaje</button>
	</div>
</div>

<style lang="postcss">
</style>