
import { faker } from '@faker-js/faker';
import type { Person, MessageFeed } from './chat.model';
//const lorem = faker.lorem.paragraph();

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

// Navigation List
export const mockpeople: Person[] = [
    { id: 0, avatar: 14, name: 'Michael' ,feed: []},
    { id: 1, avatar: 40, name: 'Janet' ,feed: []},
    { id: 2, avatar: 31, name: 'Susan' ,feed: []},
    { id: 3, avatar: 56, name: 'Joey' ,feed: []},
    { id: 4, avatar: 24, name: 'Lara' ,feed: []},
    { id: 5, avatar: 9, name: 'Melissa' ,feed: []}
];

// Messages
export const mockmessageFeed: MessageFeed[] = [
    {
        id: 0,
        host: true,
        avatar: 48,
        sender: 'Jane',
        receiver: 'Marcos',
        date: 'Yesterday @ 2:30pm',
        message: faker.lorem.paragraph()
    },
    {
        id: 1,
        host: false,
        avatar: 14,
        sender: 'Michael',
        receiver: 'Marcos',
        date: 'Yesterday @ 2:45pm',
        message: faker.lorem.paragraph()
    },
    {
        id: 2,
        host: true,
        avatar: 48,
        sender: 'Janet',
        receiver: 'Marcos',
        date: 'Yesterday @ 2:50pm',
        message: faker.lorem.paragraph()
    },
    {
        id: 3,
        host: false,
        avatar: 14,
        sender: 'Michael',
        receiver: 'Marcos',
        date: 'Yesterday @ 2:52pm',
        message: faker.lorem.paragraph()
    }
];