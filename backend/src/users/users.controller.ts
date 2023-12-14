import {
	Body,
	Controller,
	Param,
	Post,
	Get,
	UseGuards,
	Put,
	Req,
	Res
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

let imgCount: boolean = true;
@Controller('users')
@UseGuards(JwtGuard)

export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly configService: ConfigService,
	) {  }


	@Get(':login/img')
	getUserImg(@Param('login') login: string, @Res() res) {
		const imagePath = `usersdata/${login}.png`;
		if (fs.existsSync(imagePath)) {
			const fileContent = fs.readFileSync(imagePath);
			res.setHeader('Content-Type', 'image/png');
			res.send(fileContent);
		}
		return null;
	}

	/* ----------------------------- CHAT ------------------------------ */

	// GET /users/messages/:id
	@Get('messages/:login/:login2')
	getMessages(@Param('login') login: string, @Param('login2') login2: string): Promise<UserMessages[] | null> {
		return this.userService.findUserMessages(login, login2);
	}

	// POST /users/priv_messages
	@Post('priv_messages')
	createPrivateMessages(@Body() msg: UserMessages): Observable<UserMessages | null> {
		console.log ("Creamos una fecha")
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
		console.log("PEDIMOS EL USUARIO X")
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
	

	// Put /
	@Put('/')
	updateCurrentUser(@Req() req, @Res() res, @Body() user: User) {
		//TODO: validar imagen

		//Crear imagen y guardarla en el servidor
		if(user.avatar)
		{
			let imageType;
			
			imgCount = !imgCount;
			let imageName = req.user.login + imgCount;
			if (user.avatar.includes('image/jpeg')) imageType = 'jpeg';
			else if (user.avatar.includes('image/png')) imageType = 'png';
			else {
				console.log('Uknown Image extension');
				return 'Error Uknown Image extension';
			}
			const base64Data = user.avatar.replace(
				`data:image/${imageType};base64,`,
				''
			);
			try {
				if (!fs.existsSync('usersdata')) fs.mkdirSync('usersdata');
				fs.writeFile(
					`usersdata/${imageName}.png`,
					base64Data,
					'base64',
					(err) => {
						console.log(err);
					}
				);
			} catch (e) {
				console.log(e);
			}
			// Especificar la url de la imagen del usuario
			const databasePort = this.configService.get<number>('BACKEND_PORT');
			const databaseUri = this.configService.get<string>('BACKEND_BASE');
			user.avatar = `${databaseUri}:${databasePort}/users/${imageName}/img`;
		}
		

		res.send(this.userService.updateById(req.user.id, user));

	}

	
	

}
