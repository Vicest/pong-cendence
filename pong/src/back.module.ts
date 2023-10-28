import { Module } from '@nestjs/common';

//Cosas de la api
import { ApiModule } from './modules/api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBconfig } from './modules/api/orm.config';

@Module({
	imports: [
		ApiModule,
		TypeOrmModule.forRoot(DBconfig)
	],
	controllers: [],
	providers: []
})
export class BackModule {}
