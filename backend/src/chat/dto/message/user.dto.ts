import { User } from "src/users/entities/user.entity";

export class messagesUserDto {
    id: number;
    content: string;
    sender: User;
    target: User;
    created_at: Date;
}