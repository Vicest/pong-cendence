<script lang="ts">
	import { userList, updateUser } from '../../../../store/User';
	import { io } from "socket.io-client";

	let new_socket = io("http://localhost:3001",{
                    autoConnect: false,
                    transports: ['websocket']
                });

	function sendmessage() {

		
		new_socket.emit('message', "Hola mundo");
		console.log("Enviando mensaje");
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