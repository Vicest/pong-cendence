import {
	Body,
	Controller,
	Param,
	Post,
	Get,
	UseGuards,
	Put,
	Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	/* ----------------------------- CHAT ------------------------------ */

	// GET /users/messages/:id
	@Get('messages/:login/:login2')
	getMessages(
		@Param('login') login: string,
		@Param('login2') login2: string
	): Promise<UserMessages[] | null> {
		return this.userService.findUserMessages(login, login2);
	}

	// POST /users/priv_messages
	@Post('priv_messages')
	createPrivateMessages(
		@Body() msg: UserMessages
	): Observable<UserMessages | null> {
		console.log('Creamos una fecha');
		return this.userService.createUserMessage(msg);
	}

	/* ----------------------------- USERs ------------------------------ */
	// Get /users
	@Get('/')
	getAll() {
		let users = this.userService.findAll();
		return users;
	}

	// GET /users/:login
	@Get(':id')
	getOneUsers(@Param('id') id: number): Promise<User | null> {
		console.log('PEDIMOS EL USUARIO X');
		return this.userService.find(id);
	}

	// POST /users/:id
	@Post(':id')
	updateUser(@Param('id') id: number, @Body() body) {
		this.userService.updateById(id, body.data);
	}

	// POST /users
	@Post('/')
	createUsers(@Body() user: User): Observable<User> {
		return this.userService.createUser(user);
	}

	// Put /users
	@Put('/')
	updateCurrentUser(@Req() req, @Body() user: User) {
		return this.userService.updateById(req.user.id, user);
	}
}
