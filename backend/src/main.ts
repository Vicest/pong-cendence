import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	const conf: ConfigService = app.get(ConfigService);
	[
		'BACKEND_PORT',
		'FRONTEND_PORT',
		'BACKEND_BASE',
		'JWT_SECRET',
		'JWT_REFRESH_SECRET',
		'CLIENT_ID',
		'CLIENT_SECRET'
	].forEach((key) => {
		if (!conf.get(key)) {
			throw new Error(`Missing configuration key: ${key}`);
		}
	});
	const frontUri = `${conf.get<string>('BACKEND_BASE')}:${conf.get<string>(
		'FRONTEND_PORT'
	)}`;
	//Configure CORS options
	app.enableCors({
		origin: [frontUri],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true
	});

	app.use(bodyParser.json({ limit: '3mb' }));
	app.use(bodyParser.urlencoded({ limit: '3mb', extended: true }));
	app.use(bodyParser.raw({ limit: '3mb' }));

	// Add cookie parser
	app.use(cookieParser());
	const backPort = conf.get<number>('BACKEND_PORT');
	console.log(`Listening on port ${backPort}`);
	await app.listen(backPort);
}
bootstrap();
