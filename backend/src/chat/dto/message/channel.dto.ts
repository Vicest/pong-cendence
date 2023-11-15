
import { User } from "src/users/entities/user.entity";
import { Channel } from "../../entities/channel.entity";

export class messagesChannelDto {
    id: number;
    content: string;
    user: User;
    channel: Channel;
    created_at: Date;
}