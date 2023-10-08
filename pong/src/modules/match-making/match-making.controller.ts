import { Controller, Body, Headers, Post, Delete } from '@nestjs/common'
import { MatchMakingService } from './match-making.service'
import { QueuePlayer } from './queue-player'

@Controller('queue')
export class MatchMakingController {

	constructor(private readonly mms:MatchMakingService) {}

	@Post()
	//queuePlayer(@Headers('Authorization') auth:string, @Body() temp_reqs:any):void {
	queuePlayer(@Body() temp_reqs:any):void {

		//TODO
		//Validate the request comes from the user with the right auth?
		console.log(/*"Queuing: ", auth, */"BODY: ", temp_reqs)
		//Temp req come from the session service(ss)
		//user = ss.usernameOf(auth)
		//And from the database
		//rating = ss.ratingOf(user)
		//Maybe a single query to DB for the whole user info?
		//TODO is this some sort of middleware
		if (temp_reqs.user === undefined || temp_reqs.rating === undefined)
			return
			//FIXME the parseInt part should probably be in a middleware
		if (this.mms.joinQueue(new QueuePlayer(temp_reqs.user, parseInt(temp_reqs.rating)))) {
			console.log("OK!")
		} else {
			console.log("already in queue :(!")
		}
	}
	
	@Delete()
	leaveQueue(@Headers('Authorization') auth:string, @Body() temp_reqs:string): void {
		console.log("Leaving: ", auth)
		this.mms.leaveQueue(temp_reqs);
		//TODO

	}
}
