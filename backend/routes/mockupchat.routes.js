'use strict'
import express from 'express'
import { faker } from '@faker-js/faker';

//BACKEND ENDOPINTS
// msgs
// post('/msg') saveMsg() params(emmiter,receiver,msg, created_at,viewed)
// get('/receivedmsgs/:page?) params(emmiter)
// get('/sentmsg/:page?' getemitermsgs() params(receiver)
// get('/unviewedmsgs') countUnviewedMsgs
// put('/viewmsgs') setViewedMsgs()

// follows
// get('/follows') getFollows()
// post('/follow') saveFollow()
// delete('/follow/:id') deleteFollow()
// get('/following/:id?/:page?) getFollowingUsers()
// get('/followed/:id?/:page?) getFollowedUsers()


const chatroutes = express.Router();


chatroutes.get('/receivedmsgs/:userid', async (req, res) => {
    if(req.params.userid == "janet")
    {
        res.status(200).send([{
            id: 0,
            avatar: "https://i.pravatar.cc/?img=48",
            name: 'Janet',
            date: '20-03-2023',
            message: faker.lorem.paragraph()
    
        },
        {
            id: 1,
            avatar: "https://i.pravatar.cc/?img=48",
            name: 'Janet',
            date: '20-03-2023',
            message: faker.lorem.paragraph()
    
        }]);

    }
    else{
        res.status(200).send([{
            id: 2,
            avatar: "https://i.pravatar.cc/?img=12",
            name: 'Alex',
            date: '21-03-2023',
            message: faker.lorem.paragraph()
    
        },
        {
            id: 3,
            avatar: "https://i.pravatar.cc/?img=12",
            name: 'Alex',
            date: '25-05-2023',
            message: faker.lorem.paragraph()
    
        }]);
    }
})

chatroutes.get('/chattest', async (req, res) => {
    res.status(200).send({ users: "chattest" });
})

export { chatroutes }