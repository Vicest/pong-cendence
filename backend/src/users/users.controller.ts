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
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly configService: ConfigService
	) {}

	@Get('/')
	getAll() {
		const users = this.userService.findAll();
		return users;
	}

	// GET /:login --> { ... }
	//TODO revew login vs id
	@Get(':id')
	getOneUsers(@Param('id') id: number): Promise<User | null> {
		return this.userService.find(id);
	}
	@Get(':login/img')
	getUserImg(@Param('login') login: string){
		const imagePath = `usersdata/${login}.png`;
		if (fs.existsSync(imagePath)) {
			const fileContent = fs.readFileSync(imagePath);
			return fileContent;
		}
		return null;
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
		fs.writeFile('foo.png', user.avatar, 'base64', (err) => {
			console.log(err);
		});
		//Crear imagen y guardarla en el servidor
		console.log('User Avatar', user.avatar);
		const base64Data = user.avatar.replace(/^data:image\/png;base64,/, '');
		if (!fs.existsSync('usersdata')) {
			fs.mkdirSync('usersdata');
		}
		fs.writeFile(
			`usersdata/${req.user.login}.png`,
			base64Data,
			'base64',
			(err) => {
				console.log(err);
			}
		);
		// Especificar la url de la imagen del usuario
		const databasePort = this.configService.get<number>('database.port');
		const databaseUri = this.configService.get<string>('BACKEND_BASE');
		user.avatar = `${databaseUri}:${databasePort}/users/${req.user.login}/img`;

		return this.userService.updateById(req.user.id, user);
	}

	// POST /addrelation
	@Post('/addrelation')
	createRelation(@Body() data: any): Observable<UserRelation> {
		console.log('User1: ', data.user1);
		return this.userService.createRelationship(data.user1, data.user2);
	}
}
