import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchesSubscriber } from './matches.subscriber';
import { Match } from './entities/match.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Match,
		]),
	],
	controllers: [MatchesController],
	providers: [MatchesService, MatchesSubscriber],
	exports: [MatchesService],
})
export class MatchesModule {}
