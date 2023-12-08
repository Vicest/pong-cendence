import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
	secret: process.env.JWT_SECRET,
	refreshSecret: process.env.JWT_REFRESH_SECRET,
	expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 3600,
	refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10) || 86400
}));
