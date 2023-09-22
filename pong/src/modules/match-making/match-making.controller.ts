import { Controller, Body, Post, Delete } from '@nestjs/common'
import { MatchMakingService } from './match-making.service'
import { QueuePlayer } from './queue-player'

@Controller('match-making')
export class MatchMakingController {

	constructor(private readonly mms:MatchMakingService) {}

	@Post()
	queuePlayer(@Body() player:QueuePlayer):void {
	}
}
