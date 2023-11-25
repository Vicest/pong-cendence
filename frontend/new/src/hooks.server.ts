import type { Cookies, Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const isUserLoggedIn = async (cookies: Cookies): Promise<boolean> => {
	return new Promise((resolve) => {
		resolve(cookies.get("token") !== undefined);
	});

};

export const handle: Handle = async ({ event, resolve, }) => {
	const requestedPath = event.url.pathname;
	const cookies = event.cookies;

	// Auth check
	const isTokenValid = await isUserLoggedIn(cookies);

	// Restrict all routes under /admin
	if (!isTokenValid && requestedPath !== "/login" && requestedPath !== "/register" && requestedPath !== "/") {
			return new Response('Redirecting', {
				status: 302,
				headers: {
					location: "/login",
				},
			});
	} else {
		if (isTokenValid && ["/login", "/register", "/"].indexOf(requestedPath) !== -1) {
			return new Response('Redirecting', {
				status: 302,
				headers: {
					location: "/app",
				},
			});
		}
	}
	const response = await resolve(event);
	return response;
}
