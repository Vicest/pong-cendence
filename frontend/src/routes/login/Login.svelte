
<script>
    import logo42 from '$lib/assets/images/logo42.png';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    const apiBaseUrl = "http://localhost:3000";
    export let waiting;

    function handleLoginClick()
    {
        waiting = true;
    }
    

</script>
<style>
    @import 'login.css';
  
</style>
<div class="justify-content-center fadeInDown">
    <div id="formContent">
        {#if waiting == true}
            <ProgressRadial></ProgressRadial>
        {:else}
            <div class="fadeIn first">
                <img src={logo42} id="icon" alt="User Icon" />
            </div>
            <a href={`${apiBaseUrl}/login`} on:click={handleLoginClick} class="underlineHover">
                <div id="formFooter">
                Login 
                </div>
                
            </a>
        {/if}
    </div>
</div>
