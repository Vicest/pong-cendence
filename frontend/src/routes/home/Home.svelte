<script>
    import axios from 'axios';
    import { goto } from '$app/navigation';
    import { shownavlinks } from '../vars.d';
    import { onMount } from 'svelte';
    import { readable } from 'svelte/store';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
 
	import Friends from '../../components/chat/Chat.svelte';
    import { apiData } from '../../services/my42data';
	import { stringify } from 'postcss';

    shownavlinks.set(true);

    let myinfo = null;
    
    onMount(async () => {
    axios.get("http://localhost:3000/me",{withCredentials: true})
        .then(
            res => {
                myinfo = res.data
                console.log(res.data.first_name)
            }
        )
        .catch(err => {
            console.log(err)
        })
    })

    // export const apiData = readable(null, function start(set) {
    //     fetchData().then(data => {
    //         set(data);
    // });
</script>

<style>
    @import 'home.css';
  
</style>

<home>
    <Friends></Friends>
    <!-- <div class="api-data">{JSON.stringify(ApiData.displayname)}</div> -->
    <!-- <div class="home">
        <p>MY INFORMATION</p>
        {#if info}
            <p>{JSON.stringify(info.first_name)}</p>
        {:else}
            <ProgressRadial />
        {/if}
    </div> -->
</home>
