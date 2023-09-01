<script>
	import { th } from "@faker-js/faker";

  const links = ['Home', 'About', 'Team', 'Services', 'Contact Us'];
</script>

<div class="indigo theme--dark justify-center flex-column">
  <div class="mt-2 mb-2">
    {#each links as link}
      <button >{link}</button>&nbsp;&nbsp;&nbsp;
    {/each}
  </div>
  <div class="indigo lighten-1 pa-2 text-center" style="width:100%">
    2023 - <b>Pongscendence</b>
  </div>
</div>