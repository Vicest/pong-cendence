<script>
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import Friends from '../components/friends/Friends.svelte';
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { activeChat } from './vars.d';

	let showFriendsPanel=false;
	activeChat.subscribe(value => {
		showFriendsPanel = value;
	});
</script>

<style>
    @import './styles.css';

.grey-layer {

  /* position: block; */
  position: absolute;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Color de fondo transparente */
  z-index: 1; /* Z-index inferior para la capa transparente */
}
#header{
	/* position: absolute; */
	z-index: 3;
}

</style>

<div class="app" >
	<div id="header">
		<Header />
	</div>
	<div id="main">
		{#if showFriendsPanel}
  			<div class="grey-layer">
				<Friends></Friends>
			</div>
		{/if}
		<slot />
	</div>
	<div id="footer">
		<Footer />
	</div>
</div>
