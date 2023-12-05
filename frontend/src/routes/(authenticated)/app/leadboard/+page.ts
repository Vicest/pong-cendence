import { Api } from '../../../../store/Api.js';
import type { PageLoad } from './$types.js';

export const ssr = false;
export function load({ params }): PageLoad {
	return {
		users: Api.get('/users/all').then(({data}) => data),
	};
}
