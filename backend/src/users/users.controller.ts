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
import { UserRelation } from './entities/userRelations.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get('/')
	getAll() {
		let users = this.userService.findAll();
		return users;
	}

	// GET /:login --> { ... }
	//TODO revew login vs id
	@Get(':id')
	getOneUsers(@Param('id') id: number): Promise<User | null> {
		return this.userService.find(id);
	}

	@Post(':id')
	updateUser(@Param('id') id: number, @Body() body) {
		this.userService.updateById(id, body.data);
	}

	// POST /add
	@Post('/')
	createUsers(@Body() user: User): Observable<User> {
		return this.userService.createUser(user);
	}

	// Put /
	@Put('/')
	updateCurrentUser(@Req() req, @Body() user: User) {
		return this.userService.updateById(req.user.id, user);
	}

	// POST /addrelation
	@Post('/addrelation')
	createRelation(@Body() data: any): Observable<UserRelation> {
		console.log('User1: ', data.user1);
		return this.userService.createRelationship(data.user1, data.user2);
	}
}
