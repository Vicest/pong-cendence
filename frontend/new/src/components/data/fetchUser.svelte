<script lang="ts" context="module">

    import { user } from "../../store/User";
    import { apiurl} from "../../store/ApiURL";

    let url : any;
    let aux_user : any;

    apiurl.subscribe((value) => {
        url = value;
        console.log("URL changed -> ", value)
    });

    user.subscribe((value) => {
        aux_user = value;
        console.log("URL changed -> ", value)
    });

    export async function fetchUser(login : string)
    {
        return new Promise((resolve) => {
            // console.log("url -> ",  url+`/users/`+ login);
            fetch( url + `/users/` + login, {
                headers : {
                    'Access-Control-Allow-Origin' : '*'
                }})
                .then(response => {
                    if (!response.ok) {
                    throw new Error('La solicitud no se completó correctamente');
                    }
                    return response.json();
                })
                .then(data => {
                    
                    console.log("usuario recibido -> ", data);
                    aux_user = data;
                })
                .catch(error => {
                    console.error('Error de fetch en get User:', error);
                });
                resolve([])
            })
    }



</script>

