import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BackModule } from './back.module';

async function bootstrap() {
	const app = await NestFactory.create(BackModule);
	const cs:ConfigService = app.get(ConfigService);
	//We are not validating the .env file it seems (TODO)
	const frontUri:string = (cs.get<string>('BASENAME') as string).concat(':', cs.get<string>('FRONTEND_PORT') as string);

	//Configure CORS options
	app.enableCors({
		origin: [frontUri],
		methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
	});

	const backPort:number = cs.get<number>('BACKEND_PORT') as number;
	await app.listen(backPort);

}

bootstrap();
