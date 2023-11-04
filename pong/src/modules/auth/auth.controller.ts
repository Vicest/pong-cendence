import { Controller, Get, Req, Res , Next} from '@nestjs/common';
import express from 'express'
import axios from 'axios'
// import axios from 'axios';
// import axiosThrottle from 'axios-request-throttle';

// axiosThrottle.use(axios, { requestsPerSecond: 2 });

// const ensureAuth = function(req : string,res: string)
// {   
//     if(!req.session.token)
//         return res.status(500).send({message: "La peticion requiere del header authorizacion valida, session data: " + req.session});
// }

@Controller('auth')
export default class AuthController{

    
    @Get('me')
    me(@Req() req: string,@Res() res: string): string {
        //ensureAuth(req,res,next);
        axios.request({
            method: "GET",
            url: "https://api.intra.42.fr/v2/me",
            headers: {
                Accept: "application/json",
                // Authorization: `Bearer ${req.session.token}`
            }
        })
        .then(( data: any ) => {
            console.log(data);
            return data;
        })
        .catch((error: string) => {
            console.log(error);
            return error;
        });
    };
    @Get('login')
    login(@Req() req: string,@Res() res: string) {

    }



} 