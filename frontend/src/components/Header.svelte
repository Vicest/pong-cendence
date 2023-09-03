 <script>
  import ponglogo from '$lib/assets/images/ponglogo.png';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { shownavlinks }  from '../routes/vars.d'
  import { apiData } from '../services/my42data';

  let showNavs = false;
  shownavlinks.subscribe(value => {
    showNavs = value;
  });
  let apidata;
    apiData.subscribe(data => {
        apidata = data;
    });
  
  function openProfile()
  {

  }

</script>

<div class="topnav">
  <a class="active" href="/"><img src={ponglogo} alt=""></a>
  {#if showNavs}
  <div class="links">
    <button>Friends</button>
    <button >Leaderboard</button>
    <button >About</button>
  </div>
  <Avatar on:click={() => openProfile} initials={apidata.displayname.split(' ').map(palabra => palabra.charAt(0)).slice(0, 2).join('')} background="bg-primary-500" />
  {/if}
</div>

<style>
  .topnav {
    background-color: rgb(0, 0, 0);
    min-height: 80px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .topnav button {
    float: left;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }

  .topnav button:hover {
    background-color: #ddd;
    color: black;
  }

  /* .topnav button.active {
    background-color: rgb(0, 0, 0);
  } */

</style>