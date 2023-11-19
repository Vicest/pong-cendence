import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configure CORS options
  //WHY DOESN'T THIS WORK?
	app.enableCors({
		origin: ["http://localhost:5173"],//TODO Enable '*' or just the incoming requests'
		methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
	});

  await app.listen(3000);
}
bootstrap();
