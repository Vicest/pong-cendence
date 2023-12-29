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
	NotFoundException,
	BadRequestException,
	SetMetadata,
	ParseIntPipe
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ChannelMessages } from 'src/chat/entities/channel.message.entity';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get(':imgname/img')
	@SetMetadata('skipJwtGuard', true)
	getUserImg(@Param('imgname') imgName: string, @Res() res) {
		const imagePath = `usersdata/${imgName}.png`;
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
	addFriend(@Req() req, @Param('id', ParseIntPipe) id: number) {
		return this.userService.addFriend(req.user.id, id);
	}

	// Delte /friends/:id
	@Delete('/friends/:id')
	removeFriend(@Req() req, @Param('id', ParseIntPipe) id: number) {
		return this.userService.removeFriend(req.user.id, id);
	}

	// GET /users/:login
	@Get(':id')
	getOneUsers(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
		console.log('PEDIMOS EL USUARIO X');
		return this.userService.find(id);
	}

	@Get(':id/rank')
	async getRank(@Param('id', ParseIntPipe) id: number) {
		if (!(await this.userService.exists(id))) throw new NotFoundException();
		const userRank: number = await this.userService.getUserRank(id);
		return userRank;
	}

	@Get(':id/history')
	async getHistory(@Param('id', ParseIntPipe) id: number) {
		if (!(await this.userService.exists(id))) throw new NotFoundException();
		const history = await this.userService.getUserMatches(id);
		return history;
	}

	// POST /users/:id
	@Post(':id')
	updateUser(@Param('id', ParseIntPipe) id: number, @Body() body) {
		this.userService.updateById(id, body.data);
	}

	@Post(':id/ban')
	async banUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
		return await this.userService.banUser(req.user.id, id);
	}

	@Delete(':id/ban')
	async unbanUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
		return await this.userService.unbanUser(req.user.id, id);
	}

	// POST /users/:id
	@Post(':id/block')
	blockUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
		this.userService.blockUser(req.user.id, id);
	}

	// POST /users/:id
	@Delete(':id/block')
	unblockUser(@Req() req, @Param('id', ParseIntPipe) id: number) {
		this.userService.unblockUser(req.user.id, id);
	}

	// Post /friends/:id
	@Post('/:id/friend')
	sendFriendRequest(@Req() req, @Param('id', ParseIntPipe) id: number) {
		return this.userService.sendFriendRequest(req.user.id, id);
	}

	// Delete /friends/:id
	@Delete('/:id/friend')
	cancelFriendRequest(@Req() req, @Param('id', ParseIntPipe) id: number) {
		return this.userService.cancelFriendRequest(req.user.id, id);
	}

	@Post(':id/accept')
	acceptFriendRequest(@Req() req, @Param('id', ParseIntPipe) id: number) {
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
		let validateUser = await this.userService.validateUser(user, req.user);
		return await this.userService.updateById(req.user.id, validateUser);
	}
}
