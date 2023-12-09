import exp from 'constants';
import { get, writable } from 'svelte/store';
import type { Channel, Person, PrivateMessageFeed } from '$lib/types';
import { Api } from '$services/api';
import { ChatSocket } from '$services/socket';
import { loading as Authloading, currentUser } from './Auth';

export const receptor = writable<Person>();
export const type_Channel = writable();
export const chat_history = writable();

export const priv_chat_history = writable<PrivateMessageFeed[]>([]);
export const priv_msg = writable<PrivateMessageFeed[]>([]);
export const joined_channels = writable<Channel[]>([]);
export const unjoined_channels = writable<Channel[]>([]);
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
		}
	});
};

ChatSocket.on('priv_msg:created', (createdMsg) => {
	console.log('Mensaje de chat me llego :)', createdMsg, get(receptor));
	priv_msg.update((messages) => {
		return [...messages, createdMsg];
	});
	if (get(receptor)) {
		if (get(receptor).id === createdMsg.sender.id || get(receptor).id === createdMsg.receiver.id)
			priv_chat_history.update((msg) => {
				console.log('Añadimos el mensaje al historial abierto');
				return [...msg, createdMsg];
			});
	}
	console.log('Actualizamos el historial privado');
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
