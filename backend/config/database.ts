import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	host: 'postgres',
	port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB
}));
