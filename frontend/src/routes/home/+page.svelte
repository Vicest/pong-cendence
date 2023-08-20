<script>
    import axios from 'axios';
    //import Header from '../+Header.svelte';
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
<!-- <Header></Header> -->

<div class="home">
    <p>MY INFORMATION</p>
    <p>{JSON.stringify(info)}</p>
</div>