
import axios from 'axios';

export const ApiData = await axios.get("http://localhost:3000/me",{withCredentials: true})
.then(
    res => {
        // myinfo = res.data
        console.log(res.data.first_name)
        return res.data;
    }
)
.catch(err => {
    console.log(err)
})