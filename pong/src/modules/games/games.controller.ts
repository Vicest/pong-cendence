import { Controller, Get } from '@nestjs/common'
import { OngoingGamesService } from './ongoing-games.service'

@Controller('games')
export class OngoingGamesController {

	constructor(private ogs:OngoingGamesService) {}

	@Get('match_list')
	match_list() {
		return this.ogs.gamesCpy
	}

	@Get('mock_list')
	mock_list() {
		//MOCKING Match list FIXME
		return [
			{room:'game1', score:'4-2'},
			{room:'game2', score:'0-3'},
			{room:'game3', score:'6-5'},
			{room:'game4', score:'1-4'},
		]
	}
}
