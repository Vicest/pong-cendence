<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
</script>

<style>
    @import './styles.css';
</style>

<div class="app">
	<div id="header">
		<Header />
	</div>
	<div id="main">
		<slot />
	</div>
	<div id="footer">
		<Footer />
	</div>
</div>
