
import { faker } from '@faker-js/faker';
import type { Person, MessageFeed } from './chat.model';
const lorem = faker.lorem.paragraph();
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
        timestamp: 'Yesterday @ 2:30pm',
        message: lorem,
        color: 'variant-soft-primary'
    },
    {
        id: 1,
        host: false,
        avatar: 14,
        name: 'Michael',
        timestamp: 'Yesterday @ 2:45pm',
        message: lorem,
        color: 'variant-soft-primary'
    },
    {
        id: 2,
        host: true,
        avatar: 48,
        name: 'Jane',
        timestamp: 'Yesterday @ 2:50pm',
        message: lorem,
        color: 'variant-soft-primary'
    },
    {
        id: 3,
        host: false,
        avatar: 14,
        name: 'Michael',
        timestamp: 'Yesterday @ 2:52pm',
        message: lorem,
        color: 'variant-soft-primary'
    }
];