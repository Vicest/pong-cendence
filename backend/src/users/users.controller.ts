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
	FileTypeValidator,
	Delete,
	NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

import { GamesService } from 'src/games/games.service';
import { ChannelMessages } from 'src/chat/entities/channel.message.entity';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
	constructor(
		private readonly userService: UsersService,
		private readonly gameService: GamesService,
		private readonly configService: ConfigService
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

	// POST /users/priv_messages
	@Post('priv_messages')
	createPrivateMessages(
		@Body() msg: ChannelMessages
	): Observable<ChannelMessages | null> {
		return this.userService.createUserMessage(msg);
	}

	/* ----------------------------- USERS ------------------------------ */
	// Get /users
	@Get('/')
	getAll() {
		const users = this.userService.findAll();
		return users;
	}

	/* ----------------------------- USERS ------------------------------ */

	// GET /friends
	@Get('/friends')
	getFriends(@Req() req) {
		return this.userService.findFriends(req.user.id);
	}

	// GET /friends/:id
	@Post('/friends/:id')
	addFriend(@Req() req, @Param('id') id: number) {
		return this.userService.addFriend(req.user.id, id);
	}

	// Delte /friends/:id
	@Delete('/friends/:id')
	removeFriend(@Req() req, @Param('id') id: number) {
		return this.userService.removeFriend(req.user.id, id);
	}

	// GET /users/:login
	@Get(':id')
	getOneUsers(@Param('id') id: number): Promise<User | null> {
		console.log('PEDIMOS EL USUARIO X');
		return this.userService.find(id);
	}

	@Get(':id/rank')
	async getRank(@Param('id') id: number) {
		if (!(await this.userService.exists(id)))
			throw new NotFoundException();
		const userRank:number = await this.userService.getUserRank(id);
		return userRank;
	}

	// POST /users/:id
	@Post(':id')
	updateUser(@Param('id') id: number, @Body() body) {
		this.userService.updateById(id, body.data);
	}

	// POST /users/:id
	@Post(':id/block')
	blockUser(@Req() req, @Param('id') id: number) {
		this.userService.blockUser(req.user.id, id);
	}

	// POST /users/:id
	@Delete(':id/block')
	unblockUser(@Req() req, @Param('id') id: number) {
		this.userService.unblockUser(req.user.id, id);
	}

	// Post /friends/:id
	@Post('/:id/friend')
	sendFriendRequest(@Req() req, @Param('id') id: number) {
		return this.userService.sendFriendRequest(req.user.id, id);
	}

	// Delete /friends/:id
	@Delete('/:id/friend')
	cancelFriendRequest(@Req() req, @Param('id') id: number) {
		return this.userService.cancelFriendRequest(req.user.id, id);
	}

	@Post(':id/accept')
	acceptFriendRequest(@Req() req, @Param('id') id: number) {
		return this.userService.acceptFriendRequest(req.user.id, id);
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
		res.send(this.userService.updateById(req.user.id, user));
	}
}
