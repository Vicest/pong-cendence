import type { Cookies, Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const isUserLoggedIn = async (cookies: Cookies): Promise<boolean> => {
	return new Promise((resolve) => {
		fetch("http://localhost:5001/auth/me", {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${cookies.get("token")}`,
			},
		})
		.then((res) =>{
			if (res.status === 401) {
				resolve(false);
			}
			return res.json();
		})
		.then((data) => {
			resolve(data);
		});
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
	event.locals.user = isTokenValid;
	const response = await resolve(event);
	return response;
}
