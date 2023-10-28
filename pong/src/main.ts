import { NestFactory } from '@nestjs/core';
import { BackModule } from './back.module';

async function bootstrap() {
	const app = await NestFactory.create(BackModule);

	//Configure CORS options
	app.enableCors({
		origin: ['*'] //TODO Enable '*' or just the incoming requests'
	});

	await app.listen(5000); //FIXME Use evironment PORT
}

bootstrap();
