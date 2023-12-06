<script lang="ts" context="module">
	import { io } from 'socket.io-client';
	import { ApiUrl } from '../../store/Common';
	import { aux_socket } from '../../store/Socket';
	import { type_Channel, receptor, chat_history } from '../../store/Chat';

	let url = '';
	let aux_user: any;
	let aux_receptor: any;
	let aux_chat_history: any;
	let aux_type_Channel: any;

	ApiUrl.subscribe((value) => {
		url = value;
		// console.log("URL changed -> ", value)
	});


	type_Channel.subscribe((value) => {
		aux_type_Channel = value;
		// console.log("User changed -> ", value)
	});

	receptor.subscribe((value) => {
		aux_receptor = value;
		// console.log("User changed -> ", value)
	});

	chat_history.subscribe((value) => {
		aux_chat_history = value;
		// console.log("User changed -> ", value)
	});

	export async function fetchSocket() {
		return new Promise((resolve) => {
			// console.log("aux_user.nickname -> ", aux_user)
			let new_socket = io(url, {
				autoConnect: false,
				transports: ['websocket'],
				auth: {
					user: aux_user.nickname
				}
			});

			if (new_socket.disconnected) {
				new_socket.connect();
			}

			new_socket.on('priv_message', (message) => {
				type_Channel.subscribe((value) => {
					aux_type_Channel = value;
				});
				// console.log("new priv msg",message, " - chat type ", aux_type_Channel)
				aux_user._privateMessages.push(message);
				if (aux_receptor == undefined || aux_type_Channel != 'Friend') return;
				if (
					aux_receptor.nickname == message.sender.nickname ||
					aux_receptor.nickname == message.receiver.nickname
				)
					aux_chat_history.push(message);
				// console.log("metemos el mensaje y actualizamos", aux_chat_history)
				chat_history.set(aux_chat_history);
			});

			new_socket.on('group_message', (message) => {
				type_Channel.subscribe((value) => {
					aux_type_Channel = value;
				});
				// console.log("new chat msg",message," - chat type ", aux_type_Channel)
				let channelId = message.receiver.id;
				let channelIndex = aux_user.channels.findIndex((channel) => channel.id === channelId);
				if (channelIndex == -1) return;
				aux_user.channels[channelIndex].messages.push(message);
				if (aux_receptor == undefined || aux_type_Channel != 'Group') return;
				aux_chat_history = aux_user.channels[channelIndex].messages;
				chat_history.set(aux_chat_history);
			});

			new_socket.on('connect_error', (err: any) => {
				console.log(`connect_error due to ${err.message}`);
			});

			aux_socket.set(new_socket);
			// console.log("Socket seteado")
			resolve();
		});
	}
</script>
