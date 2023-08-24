<script>
  import axios from 'axios';
  import Home from './home/Home.svelte'
  import Login from './login/Login.svelte'
  import { onMount } from 'svelte';

  
  let authenticated = false;

  onMount(async () => {
    axios.get("http://localhost:3000/me",{withCredentials: true})
    .then(
      res => {
        if(res.status === 200)
        {
          // goto("/home")
          authenticated = true;
        }
          
      }
    )
    .catch(err => {
        console.log(err)
    })
  })

</script>

{#if authenticated == false}
  <Login></Login>
{:else}
  <Home></Home>
{/if}

