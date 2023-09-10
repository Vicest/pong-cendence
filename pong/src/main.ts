import { NestFactory } from '@nestjs/core';
import { BackModule } from './back.module';
import cors from 'cors';
import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";



// async function bootstrap() {
// 	const back = await NestFactory.create(BackModule);
// 	await back.listen(5000);
// }
// bootstrap();


async function bootstrap() {
	// const app = await NestFactory.create(BackModule);
	const app = await NestFactory.create(BackModule);


	// // Configure CORS options
	app.enableCors({ 
		origin: ["*"],
	  });
  
	await app.listen(5000);
  }
  
  bootstrap();