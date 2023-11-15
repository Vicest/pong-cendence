import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BackModule } from './back.module';

async function bootstrap() {
	const app = await NestFactory.create(BackModule);
	const cs:ConfigService = app.get(ConfigService);
	//We are not validating the .env file it seems (TODO)
	const frontPort:number = cs.get<number>('FRONTEND_PORT') as number;
	const frontUri:string = cs.get<string>('HOSTNAME') + ':' + frontPort;
	//Configure CORS options
	app.enableCors({
		origin: [frontUri, "http://localhost:3000", "http://localhost:4200"],//TODO Por qué tenemos el 5000, esto es back??
		methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
	});

	await app.listen(frontPort);

}

bootstrap();
