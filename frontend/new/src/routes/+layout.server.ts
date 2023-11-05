type Match = {
	id: number
	room: string
	score: [number, number]
}

type Friend = {
	id: number
	name: string
}

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	return {
		streammed: {
			matches: new Promise<Match[]>((resolve) => {
				console.log('layout load');
				setTimeout(() => {
					resolve([
						{
							id: 1,
							room: 'room2',
							score: [0, 0],
						},
						{
							id: 2,
							room: 'room2',
							score: [1, 1],
						},
						{
							id: 3,
							room: 'room3',
							score: [2, 2],
						},
						{
							id: 4,
							room: 'room4',
							score: [3, 3],
						}
					]);
				}, 3000);
			}),
			friends: new Promise<Friend[]>((resolve) => {
				setTimeout(() => {
					resolve([
						{
							id: 1,
							name: 'friend1',
						},
						{
							id: 2,
							name: 'friend2',
						},
						{
							id: 3,
							name: 'friend3',
						},
					]);
				}, 3000);
			}
			)
		}
	}
}
