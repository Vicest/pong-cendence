
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
    { id: 0, avatar: 14, name: 'Michael' },
    { id: 1, avatar: 40, name: 'Janet' },
    { id: 2, avatar: 31, name: 'Susan' },
    { id: 3, avatar: 56, name: 'Joey' },
    { id: 4, avatar: 24, name: 'Lara' },
    { id: 5, avatar: 9, name: 'Melissa' }
];

// Messages
export const mockmessageFeed: MessageFeed[] = [
    {
        id: 0,
        host: true,
        avatar: 48,
        name: 'Jane',
        date: 'Yesterday @ 2:30pm',
        message: faker.lorem.paragraph()
    },
    {
        id: 1,
        host: false,
        avatar: 14,
        name: 'Michael',
        date: 'Yesterday @ 2:45pm',
        message: faker.lorem.paragraph()
    },
    {
        id: 2,
        host: true,
        avatar: 48,
        name: 'Janet',
        date: 'Yesterday @ 2:50pm',
        message: faker.lorem.paragraph()
    },
    {
        id: 3,
        host: false,
        avatar: 14,
        name: 'Michael',
        date: 'Yesterday @ 2:52pm',
        message: faker.lorem.paragraph()
    }
];