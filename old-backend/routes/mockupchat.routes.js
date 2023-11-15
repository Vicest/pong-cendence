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

let recivedMsgs = [{
    id: 0,
    avatar: "https://i.pravatar.cc/?img=48",
    sender: 'Janet42',
    date: '20-03-2023',
    text: faker.lorem.paragraph()

},
{
    id: 1,
    avatar: "https://i.pravatar.cc/?img=48",
    sender: 'Janet42',
    date: '20-03-2023',
    text: faker.lorem.paragraph()

},
{
    id: 2,
    avatar: "https://i.pravatar.cc/?img=12",
    sender: 'Alex123',
    date: '21-03-2023',
    text: faker.lorem.paragraph()

},
{
    id: 3,
    avatar: "https://i.pravatar.cc/?img=12",
    sender: 'Alex123',
    date: '25-05-2023',
    text: faker.lorem.paragraph()

},
{
    id: 4,
    avatar: "https://i.pravatar.cc/?img=12",
    sender: 'Alex123',
    date: '25-05-2023',
    text: faker.lorem.paragraph()

}]

// setInterval(() => {recivedMsgs.push({
//     id: 1,
//     avatar: "https://i.pravatar.cc/?img=48",
//     sender: 'Janet42',
//     date: '20-03-2023',
//     text: faker.lorem.paragraph()

// })}, Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000); // Adds new Janets msgs every 5-30 segs

let sendedMsgs = []

// Post msg
chatroutes.post('/msg', (req, res) => {
    try {
      const newMessage = req.body;
  
      if (!newMessage || !newMessage.text) {
        return res.status(400).send({ error: 'Missing Params' });
      }
      newMessage.avatar = "https://i.pravatar.cc/?img=13";
      newMessage.sender = "Marcos";
      sendedMsgs.push(newMessage);
  
      res.status(200).send({ message: 'Message added' });
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).send({ error: 'Ocurrió un error interno.' });
    }
});


// Get friends
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
        res.status(200).send(recivedMsgs.filter(msg => msg.sender === 'Janet42'));

    }
    else{
        res.status(200).send(recivedMsgs.filter(msg => msg.sender != 'Janet42'));
    }
})

chatroutes.get('/sendedmsgs/:userid', async (req, res) => {
    res.status(200).send(sendedMsgs.filter(msg => msg.receiver === req.params.userid));
})

chatroutes.get('/chattest', async (req, res) => {
    res.status(200).send({ users: "chattest" });
})

export { chatroutes }