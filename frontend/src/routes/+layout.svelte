<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
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
