import type { Cookies, Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

const isUserLoggedIn = async (cookies: Cookies, refreshed = false): Promise<boolean> => {
	let token = cookies.get("token");
	let refreshToken = cookies.get("refreshToken");
	if (!token) {
		return false;
	}
	console.log("Checking if user is logged in",{
		token,
		refreshToken,
	});
	
	return new Promise((resolve) => {
		fetch(`http://backend:${process.env.BACKEND_PORT}/auth/me`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${cookies.get("token")}`,
			},
		})
			.then((res) => {
				console.log(res.status);
				if (res.status === 401 && refreshToken && !refreshed) {
					fetch(`http://backend:${process.env.BACKEND_PORT}/auth/refresh`, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${refreshToken}`,
						},
					})
						.then((res) => {
							if (res.status === 401) {
								return resolve(false);
							}
							return res.json();
						})
						.then((data) => {
							resolve(isUserLoggedIn(cookies, true));
						});

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
			console.log("redirecting to /app");
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
