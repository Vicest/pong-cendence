import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { PUBLIC_BACKEND_PORT, PUBLIC_BACKEND_BASE } from '$env/static/public';
import { Socket } from './socket';
import { lastError } from '../store/Common';

axios.defaults.timeout = 5000;

export const Api = axios.create({
	baseURL: `${PUBLIC_BACKEND_BASE}:${PUBLIC_BACKEND_PORT}`,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

let isRefreshing = false;
const refreshSubscribers: any[] = [];
function subscribeTokenRefresh(cb: any) {
	refreshSubscribers.push(cb);
}

function onRefreshed() {
	refreshSubscribers.forEach((cb) => cb());
}

const onRefreshToken = async () => {
	return Api.post('/auth/refresh');
};

const successHandler = async (response: AxiosResponse) => {
	return response;
};

const errorHandler = (error: AxiosError) => {
	const resError: AxiosResponse<any> | undefined = error.response;
	const originalRequest: any = error.config;
	if (resError?.status === 400) {
		resError.data.message.forEach(message => {
			lastError.set(message)
		});
	}
	else if (resError?.status === 401) {
		if (!isRefreshing) {
			isRefreshing = true;
			onRefreshToken()
				.then(() => onRefreshed())
				.catch(() => {
					isRefreshing = false;
				});
		}
		return new Promise((resolve) => {
			subscribeTokenRefresh(async (token: string) => {
				resolve(Api.request(originalRequest));
			});
		});
	}
	else {
		resError.data.message.forEach(message => {
			lastError.set(message)
		});
	}
	return Promise.reject({ ...resError?.data });
};

Api.interceptors.response.use(
	(response: AxiosResponse) => successHandler(response),
	(error: AxiosError) => errorHandler(error)
);
