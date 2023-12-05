import axios from 'axios';
import { writable } from 'svelte/store'
import { goto } from '$app/navigation';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

const getCookie = (name: string) => {
	let cookie = {};
	if (typeof document === 'undefined') return;
	document.cookie.split(';').forEach(function (el) {
		let split = el.split('=');
		cookie[split[0].trim()] = split.slice(1).join("=");
	})
	return cookie[name];
}

const setCookie = (name: string, value: string, days: number) => {
	if (typeof document === 'undefined') return;
	let expires = "";
	if (days) {
		let date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const removeCookie = (name: string) => {
	if (typeof document === 'undefined') return;
	document.cookie = `${name}=; Max-Age=-99999999;`;
}

export const Api = axios.create({
	baseURL: `${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`,
	headers: {
		'Authorization': 'Bearer ' + getCookie('token') || '',
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

Api.interceptors.request.use(config => {
	const token = getCookie('token');
	const refreshToken = getCookie('refreshToken');
	if (typeof token == 'undefined' && typeof refreshToken == 'undefined') {
		//return goto('/login');
	}
	return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

Api.interceptors.response.use((response) => {
	return response;
}, (error) => {
	const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
		if (isRefreshing) {
		  return new Promise((resolve, reject) => {
			failedQueue.push({ resolve, reject });
		  })
			.then(token => {
			  originalRequest.headers.Authorization = `Bearer ${token}`;
			  return axios(originalRequest);
			})
			.catch(err => err);
		}

		originalRequest._retry = true;

		isRefreshing = true;

		const refresh_token = getCookie("refreshToken");
		if (refresh_token) {
		  return new Promise((resolve, reject) => {
			axios
			  .get(Api.defaults.baseURL + "/auth/refresh", {
				headers: {
					Authorization: `Bearer ${refresh_token}`
				}
			  })
			  .then(({ data }) => {
				console.log(data);
				axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
				originalRequest.headers.Authorization = `Bearer ${data.token}`;
				processQueue(null, data.token);
				setCookie("token", data.token, 1);
				setCookie("refreshToken", data.refreshToken, 1);
				resolve(axios(originalRequest));
			  })
			  .catch(err => {
				console.log(err);
				removeCookie("refreshToken");
				removeCookie("token");
				processQueue(err, null);
				goto('/login');
				reject(err);
			  })
			  .then(() => {
				isRefreshing = false;
			  })
		  });
		}
	}
	return Promise.reject(error);
});
export const ApiUrl = writable(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`);

