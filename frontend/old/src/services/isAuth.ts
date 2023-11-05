import { auth } from "../routes/vars.d";
import { error } from '@sveltejs/kit';

export const isAuth = ()=> {
    let authenticated=false;
    auth.subscribe(value => {
        authenticated = value;
    });

    if(authenticated === false)
    throw error(500, 'Not Authorized');
}