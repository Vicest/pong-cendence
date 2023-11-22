
import axios from 'axios';
import { readable } from 'svelte/store';
import { auth } from '../routes/vars.d';
import { shownavlinks } from '../routes/vars.d';
import { waitingD } from '../routes/vars.d';

export const apiData = readable(null, function start(set) {
    axios.get("http://localhost:3000/me", { withCredentials: true })
        .then(
            res => {
                shownavlinks.set(true);
                auth.set(true);
                waitingD.set(false)
                set(res.data)
            }
        )
        .catch(err => {
            waitingD.set(false)
            //console.log(err.response.data.message)
        });
});
