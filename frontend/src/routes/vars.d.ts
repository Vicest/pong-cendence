// import { writable } from 'svelte/store';

// // Define la variable global y el store
// export let shownavlinks : boolean =  writable(true);

import { writable } from 'svelte/store';

// Define the shownavlinks store
const createShownavlinks = () => {
  const { subscribe, set } = writable(true);

  return {
    subscribe,
    set
  };
};

export const shownavlinks = createShownavlinks();