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
chatroutes.get('/friends', async (req, res) => {
    res.status(200).send([{
        id: 0,
        name: "Janet42",
        avatar: "https://i.pravatar.cc/?img=48"
    },
    {
        id: 1,
        name: "Alex123",
        avatar: "https://i.pravatar.cc/?img=12"
    }]);
})

// Get received msgs
chatroutes.get('/receivedmsgs/:userid', async (req, res) => {
    // console.log(req.params.userid)
    if(req.params.userid == "Janet42")
    {
        res.status(200).send([{
            id: 0,
            avatar: "https://i.pravatar.cc/?img=48",
            name: 'Janet42',
            date: '20-03-2023',
            message: faker.lorem.paragraph()
    
        },
        {
            id: 1,
            avatar: "https://i.pravatar.cc/?img=48",
            name: 'Janet42',
            date: '20-03-2023',
            message: faker.lorem.paragraph()
    
        }]);

    }
    else{
        res.status(200).send([{
            id: 2,
            avatar: "https://i.pravatar.cc/?img=12",
            name: 'Alex123',
            date: '21-03-2023',
            message: faker.lorem.paragraph()
    
        },
        {
            id: 3,
            avatar: "https://i.pravatar.cc/?img=12",
            name: 'Alex123',
            date: '25-05-2023',
            message: faker.lorem.paragraph()
    
        },
        {
            id: 4,
            avatar: "https://i.pravatar.cc/?img=12",
            name: 'Alex123',
            date: '25-05-2023',
            message: faker.lorem.paragraph()
    
        }]);
    }
})

chatroutes.get('/chattest', async (req, res) => {
    res.status(200).send({ users: "chattest" });
})

export { chatroutes }