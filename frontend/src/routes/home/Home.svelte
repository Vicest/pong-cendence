<script>
    import axios from 'axios';
    import { goto } from '$app/navigation';
    import { shownavlinks } from '../vars.d';
    import { onMount } from 'svelte';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
 
	import Friends from '../../components/Friends.svelte';

    shownavlinks.set(true);

    let info = null;
    
    onMount(async () => {
    axios.get("http://localhost:3000/me",{withCredentials: true})
        .then(
            res => {
                info = res.data
                console.log(res.data.first_name)
            }
        )
        .catch(err => {
            console.log(err)
        })
    })
</script>

<style>
    @import 'home.css';
  
</style>

<home>
    <Friends></Friends>
    <!-- <div class="home">
        <p>MY INFORMATION</p>
        {#if info}
            <p>{JSON.stringify(info.first_name)}</p>
        {:else}
            <ProgressRadial />
        {/if}
    </div> -->
</home>
