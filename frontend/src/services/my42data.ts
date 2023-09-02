
import axios from 'axios';
import { readable } from 'svelte/store';

export const apiData = readable(null, function start(set) {
    axios.get("http://localhost:3000/me",{withCredentials: true})
    .then(
        res => {
            // console.log(res.data.first_name)
            set(res.data)
        }
    )
    .catch(err => {
        console.log(err)
    });
});