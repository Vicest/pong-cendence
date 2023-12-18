import {
	Body,
	Controller,
	Param,
	Post,
	Get,
	UseGuards,
	Put,
	Req,
	Res,
	MaxFileSizeValidator,
	ParseFilePipe,
	UploadedFile,
	UseInterceptors,
	FileTypeValidator
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { UserMessages } from 'src/chat/entities/message/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';


@Controller('users')
@UseGuards(JwtGuard)

export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly configService: ConfigService,
	) {}

	@Get(':login/img')
	getUserImg(@Param('login') login: string, @Res() res) {
		const imagePath = `usersdata/${login}.png`;
		if (fs.existsSync(imagePath)) {
			const fileContent = fs.readFileSync(imagePath);
			res.setHeader('Content-Type', 'image/png');
			res.send(fileContent);
		} else res.sendStatus(404);
	}

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
		return this.userService.createUserMessage(msg);
	}

	/* ----------------------------- USERS ------------------------------ */
	// Get /users
	@Get('/')
	getAll(@Res() res) {
		const users = this.userService.findAll();
		res.send(users);
	}

	// GET /users/user/:login
	@Get(':login')
	async getUserByLogin(@Param('login') login: string, @Res() res) {
		const user = await this.userService.findOne(login);
		res.send(user);
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

	// PUT /
	@Put('/')
	@UseInterceptors(FileInterceptor('file'))
	async updateCurrentUser(
		@Req() req,
		@Res() res,
		@Body() user: User,
		@UploadedFile(
			new ParseFilePipe({
				fileIsRequired: false,
				validators: [
					new MaxFileSizeValidator({ maxSize: 2000000 }),
					new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
				]
			})
		)
		file: Express.Multer.File
	) {
		//TODO: validar imagen como multipart/form-data y no como json

		//Crear imagen y guardarla en el servidor
		if (user.avatar) {
			const imageName = req.user.login + Date.now().toString();
			try {
				if (!fs.existsSync('usersdata')) fs.mkdirSync('usersdata');
				fs.writeFile(
					`usersdata/${imageName}.png`,
					user.avatar,
					'base64',
					(err) => {
						console.log(err);
					}
				);
			} catch (e) {
				console.log(e);
				res.sendStatus(500);
			}
			try {
				this.userService.findOne(req.user.login).then((res) => {
					const pathFile = 'usersdata/' + res.avatar.split('/')[4] + '.png';
					if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
				});
			} catch (e) {
				console.log(e);
			}

			// Especificar la url de la imagen del usuario
			const databasePort = this.configService.get<number>('BACKEND_PORT');
			const databaseUri = this.configService.get<string>('BACKEND_BASE');
			user.avatar = `${databaseUri}:${databasePort}/users/${imageName}/img`;
		}
		if ((await this.userService.findOne(req.user.login)) && req.user.login)
			res.sendStatus(400);
		else res.send(this.userService.updateById(req.user.id, user));
	}
}
