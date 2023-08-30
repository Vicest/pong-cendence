<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import './styles.css';
</script>

<div class="app">
	<div id="header">
		<Header />
	</div>
	<main>
		<slot />
	</main>
	<footer>
		<Footer />
	</footer>
</div>

<style>
</style>
