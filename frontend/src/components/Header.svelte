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
  


</script>

<div class="topnav">
  <a class="active" href="/"><img src={ponglogo} alt=""></a>
  {#if showNavs}
  <div class="links">
    <a href="#news">Friends</a>
    <a href="#contact">Leaderboard</a>
    <a href="#about">About</a>
  </div>
  <Avatar initials={apidata.displayname.split(' ').map(palabra => palabra.charAt(0)).slice(0, 2).join('')} background="bg-primary-500" />
  {/if}
</div>

<style>
  .topnav {
    background-color: rgb(0, 0, 0);
    min-height: 80px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }

  .topnav a {
    float: left;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
  }

  .topnav a:hover {
    background-color: #ddd;
    color: black;
  }

  .topnav a.active {
    background-color: rgb(0, 0, 0);
  }

</style>