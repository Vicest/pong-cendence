 <script>
  import ponglogo from '$lib/assets/images/ponglogo.png';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { shownavlinks }  from '../routes/vars.d'
  import { activePage } from '../routes/vars.d';
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
  <button class="nohover-btn" on:click={() => {activePage.set("home")}}><img src={ponglogo} alt="pongcendence"></button>
  {#if showNavs}
  <div class="links">
    <div>
      <img src="" alt="">
      <button on:click={() => {activePage.set("friends")}}>Friends</button>
    </div>
    <div>
      <img src="" alt="">
      <button on:click={() => {activePage.set("leaderboard")}}>Leaderboard</button>
    </div>
    <div>
      <img src="" alt="">
      <button on:click={() => {activePage.set("about")}}>About</button>
    </div>
  </div>
  <button class="nohover-btn" on:click={() => {activePage.set("profile")}}>
    <Avatar initials={apidata.displayname.split(' ').map(palabra => palabra.charAt(0)).slice(0, 2).join('')} background="bg-primary-500" />
  </button>
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
    padding: 0 20px 0 20px;
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

  .links {
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button.nohover-btn:hover{
    /* pointer-events: none; */
    background-color: unset !important;
    color: unset !important;
}
 
</style>