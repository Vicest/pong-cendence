import axios from 'axios';
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';

export const Api = axios.create({
	baseURL: `${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`,
	headers: {
		Authorization: 'Bearer ' + Cookies.get('token') || '',
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

Api.interceptors.request.use((config) => {
	const token = Cookies.get('token');
	const refreshToken = Cookies.get('refreshToken');
	if (typeof token == 'undefined' && typeof refreshToken == 'undefined') {
		//return goto('/login');
	}
	return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

Api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const originalRequest = error.config;
		if (error?.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return axios(originalRequest);
					})
					.catch((err) => err);
			}

			originalRequest._retry = true;

			isRefreshing = true;

			const refresh_token = Cookies.get('refreshToken');
			if (refresh_token) {
				return new Promise((resolve, reject) => {
					axios
						.get(Api.defaults.baseURL + '/auth/refresh', {
							headers: {
								Authorization: `Bearer ${refresh_token}`
							}
						})
						.then(({ data }) => {
							axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
							originalRequest.headers.Authorization = `Bearer ${data.token}`;
							processQueue(null, data.token);
							Cookies.set('token', data.token, {
								expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
							});
							Cookies.set('refreshToken', data.refreshToken, {
								expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
							});
							resolve(axios(originalRequest));
						})
						.catch((err) => {
							console.log(err);
							Cookies.remove('refreshToken');
							Cookies.remove('token');
							processQueue(err, null);
							goto('/login');
							reject(err);
						})
						.then(() => {
							isRefreshing = false;
						});
				});
			}
		}
		return Promise.reject(error);
	}
);
export const ApiUrl = writable(`${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`);
