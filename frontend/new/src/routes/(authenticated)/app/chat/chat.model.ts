export interface Friend {
    id: number;
    nickname: string;
    email: string;
    avatar: number;
    feed: MessageFeed[];
}

export interface Person {
    // id: number;
    // avatar: number;
    // name: string;
    // feed: MessageFeed[];
    // type: string;
    // id_channel: number;
    id: number;
    nickname: string;
    email: string;
    avatar: number;
    feed: MessageFeed[];
}
export interface MessageFeed {
    id: number;
    host: boolean;
    avatar: number;
    sender: string;
    receiver: string;
    date: string;
    message: string;
}