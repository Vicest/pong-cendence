<script>
  import logo42 from '$lib/assets/images/logo42.png';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import axios from 'axios';
  import { shownavlinks } from './vars.d';
  import Home from './home/Home.svelte'

  
  let authenticated = false;
  authenticated = true;
  const apiBaseUrl = "http://localhost:3000";
  console.log(authenticated)
  axios.get("http://localhost:3000/me",{withCredentials: true})
  .then(
    res => {
      if(res.status === 200)
      {
        // goto("/home")
        authenticated = true;
        // shownavlinks.set(true);
      }
        
    }
  )
  .catch(err => {
      console.log(err)
  })

</script>
<style>
  @import 'login.css';

</style>
{#if authenticated == false}
  <div class="justify-content-center fadeInDown">
    <div id="formContent">
        <div class="fadeIn first">
        <img src={logo42} id="icon" alt="User Icon" />
        </div>
        <div id="formFooter">
        <a href={`${apiBaseUrl}/login`} class="underlineHover"> Login </a>
        </div>
    </div>
  </div>
{:else}
  <Home></Home>
{/if}

