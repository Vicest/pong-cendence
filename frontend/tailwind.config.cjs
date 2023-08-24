/** @type {import('tailwindcss').Config}*/
const config = {
	// content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 2. Append the path for the Skeleton NPM package and files:
		require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],

	theme: {
		extend: {}
	},

	plugins: [
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	]
};

module.exports = config;
