import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const conf: ConfigService = app.get(ConfigService);
	['BACKEND_PORT', 'FRONTEND_PORT', 'BACKEND_BASE'].forEach((key) => {
		if (!conf.get(key)) {
			throw new Error(`Missing configuration key: ${key}`);
		}
	});
	const frontUri = `${conf.get<string>('BACKEND_BASE')}:${conf.get<string>(
		'FRONTEND_PORT',
	)}`;
	//Configure CORS options
	app.enableCors({
		origin: [frontUri],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	});
	app.use(
		session({
			secret: 'I like trains', //TODO abiously make it random os something
			saveUninitialized: false,
			resave: false,
			cookie: {
				maxAge: null,
			},
		}),
	);

	const backPort = conf.get<number>('BACKEND_PORT');
	console.log(`Listening on port ${backPort}`);
	await app.listen(backPort);
}
bootstrap();
