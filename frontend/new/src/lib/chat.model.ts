export interface Person {
    id: number;
    nickname: string;
    avatar: string;
    isRegistered: boolean;
    two_factor_auth_secret: string;
    two_factor_auth_enabled: boolean;
    // feed: MessageFeed[];
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

export interface Group {
    id: number;
    nickname: string;
    descripcion: string;
    password: string;
    created_at: Date;
    members: Person[];
    feed: MessageFeed[];
}

