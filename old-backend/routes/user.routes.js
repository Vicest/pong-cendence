'use strict'
import express from 'express'
import fetch from 'node-fetch'
import axios from 'axios'
import axiosThrottle from 'axios-request-throttle';

axiosThrottle.use(axios, { requestsPerSecond: 2 });

const userroutes = express.Router();
import { ensureAuth } from '../middlewares/authentication.js'
import { getToken } from '../middlewares/publicApiToken.js'


import ClientOAuth2 from 'client-oauth2'
import dotenv from 'dotenv'
dotenv.config(); 

var auth = new ClientOAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessTokenUri: process.env.ACCESS_TOKEN_URI,
    authorizationUri: process.env.AUTHORIZATION_URI,
    redirectUri: process.env.REDIRECT_URI
});


//---------------
// Session routes
//---------------
userroutes.get('/refresh-session', (req, res) => {
    if (req.session.refresh)
	{
		axios({
			method: 'post',
			url: process.env.ACCESS_TOKEN_URI,
			headers: {'Content-Type': 'application/json'}, 
			data: {
                'grant_type': 'refresh_token',
                'refresh_token': req.session.refresh,
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET
			}
        })
		.then(function (response) {
			req.session.refresh = response.data.refresh_token;
			req.session.token = response.data.access_token;
			req.session.expires_in = response.data.expires_in;
			req.session.created_at = response.data.created_at;
			//res.send({session: req.session});
            return res.redirect(`${process.env.FRONT_BASE_URI}/`);
		})
		.catch(function (error) {
			res.send("Error: " + error);
		});
	}
	else
		res.status(500).send({error: "You must log with 42 auth for refreshing tokens"});
});
userroutes.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: "Session destroyed" });
});

userroutes.get('/login', (req, res) => {
    res.redirect(`${process.env.INTRA_URL}/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}`)
});


userroutes.get('/me', ensureAuth, async (req, res) => {
    console.log(`Bearer ${req.session.token}`)
	return new Promise((resolve, reject) => {
		axios
			.request({
				method: "GET",
				url: "https://api.intra.42.fr/v2/me",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${req.session.token}`
				}
			})
			.then(({ data }) => {
                console.log(data);
                res.send(data);
				resolve(data);
			})
			.catch((error) => {
                console.log(error);
				reject(error);
			});
	});
});


userroutes.get("/callback", (req, res) => {
	axios.request({
			method: "POST",
			url: "https://api.intra.42.fr/oauth/token",
			data: {
				code: req.query.code,
				client_secret: process.env.CLIENT_SECRET,
				client_id: process.env.CLIENT_ID,
				redirect_uri: `${process.env.REDIRECT_URI}`,
				grant_type: "authorization_code"
			},
			headers: {
				Accept: "application/json"
			}
		})
		.then(async (response) => {
            console.log(response.data);
            req.session.token = response.data.access_token;
            req.session.refresh = response.data.refresh_token;
            req.session.expires_in = response.data.expires_in;
            req.session.created_at = response.data.created_at;
            
            // req.session.user = await getIntraUserData(
			// 	`Bearer ${response.data.access_token}`
			// );
            //return res.send(req.session);
            return res.redirect(`${process.env.FRONT_BASE_URI}/`);

		})
		.catch((error) => {
			res.status(403).send(error);
		});

});

//---------------
// User routes
//---------------

const getCoalition = async function(token)
{
    const userId = await axios.get(`${process.env.INTRA_URL}/v2/me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }, {timeout: 300000}).then(function ({data}) {
        return(data.id);
    })
    .catch(function (error) {
        return ({Error: "userId" + error});
    });

    //console.log(userId);
    
    const userCoalition = await axios.get(`${process.env.INTRA_URL}/v2/users/${userId}/coalitions`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }, {timeout: 300000}).then(function ({data}) {
        const ret = data[0].name
        return (ret);
    })
    .catch(function (error) {
        return ({Error: "userCoalition" + error});
    });

    //console.log(userCoalition)
    return(userCoalition);

};

userroutes.get('/user/:login', getToken, async (req, res) => {
    const data = await fetch(`${process.env.INTRA_URL}/v2/users/${req.params.login}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.intraAccessToken}`
        }
    })
        .catch(err => {
            res.send(err);
        })
    const user = await data.json();
    res.send(user);
})

userroutes.get('/users', getToken, async (req, res) => {
    const data = await fetch(`${process.env.INTRA_URL}/v2/campus/22`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.intraAccessToken}`
        }
    })
        .catch(err => {
            res.send(err);
        })
    const users = await data.json();
    res.send( users );
})

userroutes.get('/test', ensureAuth, async (req, res) => {
    res.status(200).send({ users: "users" });
})

userroutes.get('/',  async (req, res) => {
    res.status(200).send( "Welcome to API" );
})

///users/:user_id/coalitions

export { userroutes }