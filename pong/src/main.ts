import { NestFactory } from '@nestjs/core';
import { BackModule } from './back.module';

async function bootstrap() {
	const app = await NestFactory.create(BackModule);

	//Configure CORS options
	app.enableCors({
		origin: ["http://localhost:5000", "http://localhost:3000" , "http://localhost:4200"],
		methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
	});

	await app.listen(5000); //FIXME Use evironment PORT

}

bootstrap();
