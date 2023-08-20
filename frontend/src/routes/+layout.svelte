<script>
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
</script>

<div class="app">
	<header>
		<Header />
	</header>
	<main>
		<slot />
	</main>
	<footer>
		<Footer />
	</footer>
	
</div>

<style>

</style>
