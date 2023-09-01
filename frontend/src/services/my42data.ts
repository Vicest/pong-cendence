
import axios from 'axios';
import { readable } from 'svelte/store';


// export const ApiData = await axios.get("http://localhost:3000/me",{withCredentials: true})
// .then(
//     res => {
//         // myinfo = res.data
//         console.log(res.data.first_name)
//         return res.data;
//     }
// )
// .catch(err => {
//     console.log(err)
// })

export const apiData = readable(null, function start(set) {
    axios.get("http://localhost:3000/me",{withCredentials: true})
    .then(
        res => {
            // myinfo = res.data
            // console.log(res.data.first_name)
            set(res.data)
        }
    )
    .catch(err => {
        console.log(err)
        console.log("hola1")
    });
});