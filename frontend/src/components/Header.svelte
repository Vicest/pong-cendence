 <script>
  import ponglogo from '$lib/assets/images/ponglogo.png';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { shownavlinks }  from '../routes/vars.d'
  import { activePage } from '../routes/vars.d';
  import { activeChat } from '../routes/vars.d';
  import { apiData } from '../services/my42data';

  let showNavs = false;
  shownavlinks.subscribe(value => {
    showNavs = value;
  });
  let apidata;
    apiData.subscribe(data => {
        apidata = data;
  });
  let showchat=false;
	activeChat.subscribe(value => {
		showchat = value;
	});
</script>

<div class="topnav">
  <button class="nohover-btn" on:click={() => {activePage.set("home")}}><img src={ponglogo} alt="pongcendence"></button>
  {#if showNavs}
  <div class="links">
    <div  class="nav-links">
      <img src="" alt="">
      <button class="nohover-btn" on:click={() => {activeChat.set(!showchat)}}>Friends</button>
      <!-- <a href="/friends">Friends</a> -->
    </div>
    <a  class="nav-links" href="/leaderboard">
        <img src="/" alt="">
        <!-- <button on:click={() => {activePage.set("leaderboard")}}>Leaderboard</button> -->
        Leaderboard
    </a>
    <a class="nav-links" href="/about">
        <img src="" alt="">
        <!-- <button on:click={() => {activePage.set("about")}}>About</button> -->
        About
    </a>
  </div>
  <!-- <button class="nohover-btn" on:click={() => {activePage.set("profile")}}> -->
  <a href="/profile">
    <Avatar initials={apidata.displayname.split(' ').map(palabra => palabra.charAt(0)).slice(0, 2).join('')} background="bg-primary-500" />
  </a>
  <!-- </button> -->
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
    z-index: 3;
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

  .nav-links{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;


  }
  .nav-links:hover{
    background-color: white;
    color: black;
  }
  button.nohover-btn:hover{
    /* pointer-events: none; */
    background-color: unset !important;
    color: unset !important;
}
 
</style>