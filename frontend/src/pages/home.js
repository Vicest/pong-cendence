//const dotenv = require('dotenv');
//require('dotenv').config();
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const  Home = ()=> {
    //const env = dotenv.config().parsed;
    //const env = process.env.API_URL
    const [info, setInfo] = useState("");
    const callApi =  ()  => {
        axios.get("http://localhost:3000/me",{withCredentials: true})
        .then(
            data => {
                setInfo({me: data})
            }
        )
        .catch(err => {
            console.log(err)
        })
    }
    useEffect(callApi, [])
    
    return (
        <div className="home">
            <p>MY INFORMATION</p>
            <p>{JSON.stringify(info)}</p>
        </div>
    );
}

export default Home;
  
  