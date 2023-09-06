<script>
  import axios from 'axios';
  import Home from './home/Home.svelte'
  import Login from './login/Login.svelte'
  import Profile from './profile/Profile.svelte';
  import Friends from '../components/friends/Friends.svelte';
  import { onMount } from 'svelte';
  import { shownavlinks } from './vars.d';
  import { activePage } from './vars.d';
	import Leaderboard from './leaderboard/Leaderboard.svelte';
	import About from './about/About.svelte';

  // activePage.set("home") 

  let currentPage;
  $: {
      const page = $activePage;
      switch (page) {
          case 'home':
              currentPage = Home;
              break;
          case 'profile':
              currentPage = Profile;
              break;
          case 'leaderboard':
              currentPage = Leaderboard;
              break;
          case 'about':
              currentPage = About;
              break;
          case 'friends':
              currentPage = Friends;
              break;
          default:
              currentPage = null;
      }
  }
  
  let authenticated = false; // ALERT: Must be in false
  let waiting = true;

  onMount(async () => {
    
    await axios.get("http://localhost:3000/me",{withCredentials: true})
    .then(
      res => {
        if(res.status === 200)
        {
          waiting = false;
          authenticated = true;
          shownavlinks.set(true);
        }
          
      }
    )
    .catch(err => {
        waiting = false;
        console.log(err)
    })
  })

</script>

{#if authenticated == false}
  <Login waiting={waiting}></Login>
{:else}
  {#if currentPage}
        <svelte:component this={currentPage} />
    {:else}
        <p>Page not found</p>
  {/if}
{/if}

