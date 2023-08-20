<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import axios from 'axios';

  const apiBaseUrl = "http://localhost:3000";
  axios.get("http://localhost:3000/me",{withCredentials: true})
  .then(
    res => {
      if(res.status === 200)
        goto("/home")
    }
  )
  .catch(err => {
      console.log(err)
  })

</script>
<style>
  @import 'login.css';

</style>

<div class="justify-content-center fadeInDown">
  <div id="formContent">
      <div class="fadeIn first">
      <img src="https://raw.githubusercontent.com/InigoRomero/42ItTest/main/42Icon.jpeg?token=AK5DQMZPDGPOKG2TZ3CF6XDATK74Y" id="icon" alt="User Icon" />
      </div>
      <div id="formFooter">
      <a href={`${apiBaseUrl}/login`} class="underlineHover"> Login </a>
      </div>
  </div>
</div>
