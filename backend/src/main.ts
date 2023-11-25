import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	const conf:ConfigService = app.get(ConfigService);

	//We are not validating the .env file it seems (TODO)
	const frontUri:string = (conf.get<string>('BASENAME') as string).concat(':', conf.get<string>('FRONTEND_PORT') as string);
  //Configure CORS options
	app.enableCors({
		origin: [frontUri],
		methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
	});
	app.use(session({
		secret: 'I like trains',//TODO abiously make it random os something
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: null,
		},
	})); 

  const backPort:number = conf.get<number>('BACKEND_PORT') as number;
  await app.listen(backPort);
}
bootstrap();
