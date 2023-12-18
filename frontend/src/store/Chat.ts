import { get, writable } from 'svelte/store';
import type { Channel, Person, PrivateMessageFeed , ChatMessageFeed } from '$lib/types';
import { Api } from '$services/api';
import { ChatSocket } from '$services/socket';
import { loading as Authloading, currentUser } from './Auth';
import { userList } from './User';

//Chat de Grupos
export const chat_receptor = writable<Channel>();//
export const type_Channel = writable();
export const chat_history = writable<ChatMessageFeed[]>([]);
export const unjoined_channels = writable<Channel[]>([]);
export const joined_channels = writable<Channel[]>([]);
export const invitations_channels = writable<Channel[]>([]);

//Chat Privados
export const receptor = writable<Person>();
export const priv_chat_history = writable<PrivateMessageFeed[]>([]);
export const priv_msg = writable<PrivateMessageFeed[]>([]);


export const loading = writable<boolean>(true);
loading.set(true);

export const init = () => {
	const unsubscribe = Authloading.subscribe((value) => {
		if (!value) {
			unsubscribe(); // Detener la suscripción una vez que Authloading sea falso
			Api.get('/chat/messages_history')
				.then(({ data }) => {
					// console.log("Que cojones me llega", data)
					priv_msg.set(data);
					setTimeout(() => {
						loading.set(false);
					}, 1000);
					// console.log("Pillamos mensajes? -> ", get(priv_msg));
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {});

			Api.get('/chat/joinedchannels')
				.then(({ data }) => {
					joined_channels.set(data);
					console.log('Obtenemos todos los canales en los que estoy ', get(joined_channels));
					setTimeout(() => {
						loading.set(false);
					}, 1000);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {});
			Api.get('/chat/unjoinedchannels')
				.then(({ data }) => {
					unjoined_channels.set(data);
					console.log('Obtenemos todos los canales en los que no estoy', get(unjoined_channels));
					setTimeout(() => {
						loading.set(false);
					}, 1000);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {});
				Api.get('/chat/invitations_channels')
				.then(({ data }) => {
					invitations_channels.set(data);
					console.log('Obtenemos todos los canales en los que me han invitado', get(invitations_channels));
					setTimeout(() => {
						loading.set(false);
					}, 1000);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {});
		}
	});
};

ChatSocket.on('priv_msg:created', (createdMsg) => {
	console.log('priv_msg:created -> ', createdMsg);
	priv_msg.update((messages) => {
		return [...messages, createdMsg];
	});
	if (get(receptor)) {
		if (get(receptor).id === createdMsg.sender.id || get(receptor).id === createdMsg.receiver.id)
			priv_chat_history.update((msg) => {
				console.log('Añadimos el mensaje al historial entre personas');
				return [...msg, createdMsg];
			});
	}
});

ChatSocket.on('chat_msg:created', (createdMsg) => {
	console.log('chat_msg:created -> ', createdMsg);
	joined_channels.update((channels) => {
        const channelToUpdate = channels.find((channel) => channel.id === createdMsg.receiver.id);
        if (channelToUpdate) {
            channelToUpdate.messages.push(createdMsg);
        }
        return channels;
    });
	if (get(chat_receptor)) {
		if (get(chat_receptor).id === createdMsg.receiver.id)
			chat_history.update((chat) => {
				// chat.push(createdMsg);
				return chat;
			});
	}
});

ChatSocket.on('channel:created', (createdChannel) => {
	console.log('channel:created -> ', createdChannel);
	unjoined_channels.update((channels) => {
		createdChannel.messages = [];
		createdChannel.members = [];
		return [...channels, createdChannel];
	});
});


function updateChannel(channelId : number, updatedChannel : Channel) {
	return (channels) => {
		const channelIndex = channels.findIndex(channel => channel.id === channelId);
		if (channelIndex !== -1) {
			channels[channelIndex] = {
				...channels[channelIndex],
				nickname: updatedChannel.nickname,
				password: updatedChannel.password,
				description: updatedChannel.description,
				type: updatedChannel.type
			};
		}
		return channels;
	};
}

ChatSocket.on('channel:updated', (updatedChannel) => {
	console.log('channel:updated -> ', updatedChannel);
	
	unjoined_channels.update(updateChannel(updatedChannel.id, updatedChannel));
	joined_channels.update(updateChannel(updatedChannel.id, updatedChannel));
	invitations_channels.update(updateChannel(updatedChannel.id, updatedChannel));
});



ChatSocket.on('channelmember:created', (createdChannelMember) => {
    console.log('channelmember:created -> ', createdChannelMember);
	if (get(currentUser).id === createdChannelMember.user_id)
	{
		Api.get('/chat/channel/'+ createdChannelMember.channel_id)
			.then((response) => {
				console.log("Respuesta de la peticion", response.data);
				if (createdChannelMember.status === 'Invited') {
					invitations_channels.update((channels) => {
						return [...channels, response.data];
					});
					console.log('Obtenemos todos los canales en los que me han invitado', get(invitations_channels));
				}
				else
				{
					joined_channels.update((channels) => {
						return [...channels, response.data];
					});
					invitations_channels.update((channels) => {
						return channels.filter((channel) => channel.id !== createdChannelMember.channel_id);
					});
					console.log('Obtenemos todos los canales en los que estoy', get(joined_channels));
				}
				unjoined_channels.update((channels) => {
					return channels.filter((channel) => channel.id !== createdChannelMember.channel_id);
				});
				
		})
	}
	else
	{
		joined_channels.update((channels) => {
			return channels.map((channel) => {
				if (channel.id === createdChannelMember.channel_id) {
					let index = get(userList).findIndex((user) => user.id === createdChannelMember.user_id);
					let newMember = get(userList)[index];
					newMember.channel_status = createdChannelMember.status;
					return {
						...channel,
						members: [...channel.members, newMember]
					};
				}
				return channel;
			});
		});

		
	} 
});


ChatSocket.on('channelmember:updated', (updatedMember) => {
	console.log('channelmember:updated -> ', updatedMember);
	if (get(currentUser).id === updatedMember.user_id)
	{
		joined_channels.update((channels) => {
			let chan_index = channels.findIndex((channel) => channel.id === updatedMember.channel_id);
			if (chan_index !== -1) {
				let user_index = channels[chan_index].members.findIndex((user) => user.id === updatedMember.user_id);
				if (user_index !== -1)
				channels[chan_index].members[user_index].channel_status = updatedMember.status;
			}
			return channels;
		});
		unjoined_channels.update((channels) => {
			return channels.filter((channel) => channel.id !== updatedMember.channel_id);
		});
		invitations_channels.update((channels) => {
			return channels.filter((channel) => channel.id !== updatedMember.channel_id);
		});
		
	}
	else
	{
		joined_channels.update((channels) => {
			let chan_index = channels.findIndex((channel) => channel.id === updatedMember.channel_id);
			if (chan_index !== -1) {
				let user_index = channels[chan_index].members.findIndex((user) => user.id === updatedMember.user_id);
				if (user_index !== -1)
				channels[chan_index].members[user_index].channel_status = updatedMember.status;
			}
			return channels;
		});
		invitations_channels.update((channels) => {
			let chan_index = channels.findIndex((channel) => channel.id === updatedMember.channel_id);
			if (chan_index !== -1) {
				let user_index = channels[chan_index].members.findIndex((user) => user.id === updatedMember.user_id);
				if (user_index !== -1)
				channels[chan_index].members[user_index].channel_status = updatedMember.status;
			}
			return channels;
		});
	}
});


ChatSocket.on('channelmember:deleted', (deletedChannelMember) => {
	console.log('channelmember:deleted -> ', deletedChannelMember);
	joined_channels.update((channels) => {
		let updatedChannels = channels.map((channel) => {
            if (channel.id === deletedChannelMember.channel_id) {
                channel.members = channel.members.filter((user) => user.id !== deletedChannelMember.user_id);
            }
            return channel;
        });
        return updatedChannels;
	});
	invitations_channels.update((channels) => {
		let updatedChannels = channels.map((channel) => {
            if (channel.id === deletedChannelMember.channel_id) {
                channel.members = channel.members.filter((user) => user.id !== deletedChannelMember.user_id);
            }
            return channel;
        });
        return updatedChannels;
	});

	if (get(currentUser).id === deletedChannelMember.user_id)
	{
		let index = get(joined_channels).findIndex((channel) => channel.id === deletedChannelMember.channel_id);
		let findedChannel : Channel;
		if (!index)
		{
			index = get(invitations_channels).findIndex((channel) => channel.id === deletedChannelMember.channel_id);
			findedChannel = get(invitations_channels)[index]
		}
		else
			findedChannel = get(joined_channels)[index];
		joined_channels.update((channels) => {
			return channels.filter((channel) => channel.id !== deletedChannelMember.channel_id);
		});
		invitations_channels.update((channels) => {
			return channels.filter((channel) => channel.id !== deletedChannelMember.channel_id);
		});
		unjoined_channels.update((channels) => {
			return [...channels, findedChannel];
		});
	}
	
});


export const mock_user_list = writable<Array<Person>>([]);
export const mock_friends = writable<Array<Person>>([]);
export const mock_blocked = writable<Array<Person>>([]);
export const mock_priv_msg = writable([{}]);
export const mock_channels = writable([{}]);




























mock_blocked.set([
	{
		id: 6,
		nickname: 'mtacuna',
		avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/mtacuna.jpg',
		two_factor_auth_enabled: false,
		login: 'Maria',
		status: 'online'
	}
]);

mock_friends.set([
	{
		id: 2,
		nickname: 'vicmarti',
		avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg',
		two_factor_auth_enabled: false
	},
	{
		id: 8,
		nickname: 'priezu-m',
		avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg',
		two_factor_auth_enabled: false
	},
	{
		id: 3,
		nickname: 'aborbol',
		avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg',
		two_factor_auth_enabled: false
	},
	{
		id: 4,
		nickname: 'josuna',
		avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg',
		two_factor_auth_enabled: false
	},
	{
		id: 5,
		nickname: 'msantos-',
		avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg',
		two_factor_auth_enabled: false
	}
]);

mock_channels.set([
	{
		id: 1,
		nickname: 'El Grupaso',
		description: 'Este canal es de prueba',
		password: '',
		created_at: '2023-11-28T03:23:37.913Z',
		messages: [
			{
				id: 1,
				content: 'Hola :)',
				created_at: '2023-11-28T03:25:38.149Z',
				sender: {
					id: 1,
					nickname: 'mortiz-d',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 4,
				content: 'Hey!',
				created_at: '2023-11-28T03:26:11.892Z',
				sender: {
					id: 2,
					nickname: 'vicmarti',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 5,
				content: 'saludos',
				created_at: '2023-11-28T03:26:21.665Z',
				sender: {
					id: 3,
					nickname: 'aborbol',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			}
		],
		members: [
			{
				id: 1,
				nickname: 'mortiz-d',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			},
			{
				id: 2,
				nickname: 'vicmarti',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/vicmarti.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			},
			{
				id: 3,
				nickname: 'aborbol',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/aborbol.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			}
		]
	},
	{
		id: 2,
		nickname: 'El gran Grupo',
		description: 'Este canal es de prueba',
		password: '',
		created_at: '2023-11-28T03:23:50.021Z',
		messages: [
			{
				id: 2,
				content: 'Hola :(',
				created_at: '2023-11-28T03:25:49.555Z',
				sender: {
					id: 1,
					nickname: 'mortiz-d',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 6,
				content: 'No eres bienvenido',
				created_at: '2023-11-28T03:26:58.771Z',
				sender: {
					id: 4,
					nickname: 'josuna',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 7,
				content: 'Largate',
				created_at: '2023-11-28T03:27:13.518Z',
				sender: {
					id: 5,
					nickname: 'msantos-',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			}
		],
		members: [
			{
				id: 1,
				nickname: 'mortiz-d',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			},
			{
				id: 4,
				nickname: 'josuna',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/josuna.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			},
			{
				id: 5,
				nickname: 'msantos-',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/msantos-.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			}
		]
	},
	{
		id: 3,
		nickname: 'La tercera Ronda',
		description: 'Este canal es de prueba',
		password: '',
		created_at: '2023-11-28T03:24:08.684Z',
		messages: [
			{
				id: 3,
				content: 'Hola :l',
				created_at: '2023-11-28T03:25:57.293Z',
				sender: {
					id: 1,
					nickname: 'mortiz-d',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 8,
				content: 'Este era el sitio para llorar no?',
				created_at: '2023-11-28T03:27:28.747Z',
				sender: {
					id: 8,
					nickname: 'priezu-m',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 9,
				content: 'Si .... :,l',
				created_at: '2023-11-28T03:27:41.764Z',
				sender: {
					id: 9,
					nickname: 'afelicia',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/afelicia.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			},
			{
				id: 10,
				content: 'Que depresivo todo :v',
				created_at: '2023-11-28T03:28:01.066Z',
				sender: {
					id: 1,
					nickname: 'mortiz-d',
					email: null,
					avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
					two_factor_auth_secret: null,
					two_factor_auth_enabled: false
				}
			}
		],
		members: [
			{
				id: 1,
				nickname: 'mortiz-d',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/033957f65007645106a06dd59c0e7f34/mortiz-d.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			},
			{
				id: 9,
				nickname: 'afelicia',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/afelicia.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			},
			{
				id: 8,
				nickname: 'priezu-m',
				email: null,
				avatar: 'https://cdn.intra.42.fr/users/651ee96345c2c4c45bc14f3aa9e71738/priezu-m.jpg',
				two_factor_auth_secret: null,
				two_factor_auth_enabled: false
			}
		]
	}
]);
