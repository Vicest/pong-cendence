import { writable } from 'svelte/store'

export const user = writable();

export const userList = writable([
	{
		id: 1,
		name: 'user1',
		avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
	},
]);

setTimeout(() => {
	userList.update((user) => [
		...user,
		{
			id: 2,
			name: 'user2',
			avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
		},
	]);
}, 3000);


export const updateUser = (id: number) => {
	userList.update((user) => {
		return user.map((u) => {
			if (u.id === id) {
				return {
					...u,
					name: 'updated',
				};
			}
			return u;
		});
	});
}
