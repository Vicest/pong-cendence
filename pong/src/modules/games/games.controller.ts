import { Controller, Get } from '@nestjs/common'
import { OngoingGamesService } from './ongoing-games.service'

@Controller('games')
export class OngoingGamesController {

	constructor(private ogs:OngoingGamesService) {}

	@Get('match_list')
	async match_list() {
		//TODO Maybe transfer less. Maybe use a ws to send an update?
		let matchInfo:{room:string,score:[number,number]}[] = Array.from(this.ogs.games,
			([key, value]) => {
				let item:{room:string,score:[number,number]} = {room:key, score:value.score};
				return item
			})

		console.log("Back: ", matchInfo)
		return matchInfo
	}
}
