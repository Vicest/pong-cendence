'use strict'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config();

const getToken = async function(req,res,next)
{
    try{
        const tokeninfo = await fetch(`${process.env.INTRA_URL}/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                grant_type: "client_credentials",
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            })
        })
        if(!tokeninfo.ok) throw new Error("El token no se ha podido recoger")
        req.intraAccessToken = (await tokeninfo.json()).access_token;
        console.log(req.intraAccessToken)
        next();
    }
    catch(err)
    {
        res.send(err)

    }
    

}

export { getToken }