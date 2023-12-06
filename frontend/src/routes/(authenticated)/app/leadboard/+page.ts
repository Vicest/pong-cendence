import { Api } from '$services/api';
import type { PageLoad } from './$types.js';

export const ssr = false;
export function load({ params }): PageLoad {
	return {};
}
