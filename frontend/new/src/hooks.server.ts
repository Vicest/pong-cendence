import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const isUserLoggedIn = async (cookies): Promise<boolean> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(false);
		}, 2000);
	});

};

export const handle: Handle = async ({ event, resolve, }) => {
	const requestedPath = event.url.pathname;
	const cookies = event.cookies;

	// Auth check
	const isTokenValid = await isUserLoggedIn(cookies);

	console.log("cookies", isTokenValid);

	// Restrict all routes under /admin
	if (requestedPath !== "/login" && requestedPath !== "/register" && requestedPath !== "/") {
		if (!isTokenValid) {
			return new Response('Redirecting', {
				status: 302,
				headers: {
					location: "/login",
				},
			});
		}
	}
	const response = await resolve(event);
	return response;
}
