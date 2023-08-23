<script>
    import axios from 'axios';
    import { goto } from '$app/navigation';
    import { shownavlinks } from '../vars.d';
	import Friends from '../../components/Friends.svelte';

    shownavlinks.set(true);
    
    var info;

    axios.get("http://localhost:3000/me",{withCredentials: true})
        .then(
            data => {
                info = ({me: data})
            }
        )
        .catch(err => {
            console.log(err)
        })
</script>

<home>
    <Friends></Friends>
    <div class="home">
        <p>MY INFORMATION</p>
        <p>{JSON.stringify(info)}</p>
    </div>
</home>
