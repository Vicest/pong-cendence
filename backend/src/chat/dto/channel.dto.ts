
export class ChannelDto {
    id: number;
    name:string;
    description: string;
    password: string;
    created_at: Date;
    members: string[];
    messages: string[];
}