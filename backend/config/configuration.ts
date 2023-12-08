export default () => ({
	baseUrl: process.env.BACKEND_BASE,
	port: parseInt(process.env.BACKEND_PORT, 10) || 5001
});
