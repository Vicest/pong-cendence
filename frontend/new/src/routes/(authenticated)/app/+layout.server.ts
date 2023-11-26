export const ssr = false;
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, cookies }) => {

  return {
    user: locals.user,
  }
}