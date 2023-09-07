// import { writable } from 'svelte/store';

// // Define la variable global y el store
// export let shownavlinks : boolean =  writable(true);

import { writable } from 'svelte/store';

// Define the shownavlinks store
const createShownavlinks = () => {
  const { subscribe, set } = writable(false);

  return {
    subscribe,
    set
  };
};

export const activePage = writable('home'); 
export const activeChat = createShownavlinks();

export const shownavlinks = createShownavlinks();