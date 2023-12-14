import { UserDto } from './users.dto';

export class UserRelationsDto {
	id: number;
	sender: UserDto;
	receptor: UserDto;
	status: number;
}
