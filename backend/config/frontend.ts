import { registerAs } from '@nestjs/config';

export default registerAs('frontend', () => ({
	baseUrl: `${process.env.BACKEND_BASE}:${
		parseInt(process.env.FRONTEND_PORT, 10) || 5173
	}`,
	port: parseInt(process.env.FRONTEND_PORT, 10) || 5173
}));
