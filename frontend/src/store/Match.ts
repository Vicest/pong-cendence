import { writable } from 'svelte/store'

export const matchList = writable([
	{
		id: 1,
		title: 'match1',
		room: 'room1',
		score: [1, 2],
	},
	{
		id: 2,
		title: 'match2',
		room: 'room2',
		score: [1, 1],
	},
]);

export const updateScore = (id: number, score: [number, number]) => {
	matchList.update((match) => {
		return match.map((m) => {
			if (m.id === id) {
				return {
					...m,
					score: score,
				};
			}
			return m;
		});
	});
}

setTimeout(() => {
	updateScore(2, [2, 2]);
}, 3000);
