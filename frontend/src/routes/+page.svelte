<script>
  import axios from 'axios';
  import Home from './home/Home.svelte'
  import Login from './login/Login.svelte'
  import { onMount } from 'svelte';
  import { shownavlinks } from './vars.d';
  
  let authenticated = false;
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
  <Home></Home>
{/if}

