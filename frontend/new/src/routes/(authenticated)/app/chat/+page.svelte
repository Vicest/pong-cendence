<script lang="ts">
	import { userList, updateUser, user } from '../../../../store/User';
	import { io } from "socket.io-client";
	import { aux_socket } from '../../../../store/Socket';

	
	let socket: any;
	let User:any;

    aux_socket.subscribe((value) => {
        socket = value;
        console.log("URL changed -> ", value)
    });

	user.subscribe((value) => {
        User = value;
        console.log("User changed -> ", value)
    });

	let Msg = {
		id: 0,
		content: "Que mierda es esta",
		sender: User,
		target: User,
		created_at: "2021-10-10 10:10:10"
	}

	function sendmessage()
	{
		socket.emit('message', Msg);
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