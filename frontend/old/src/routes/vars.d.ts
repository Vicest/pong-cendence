// import { writable } from 'svelte/store';

// // Define la variable global y el store
// export let shownavlinks : boolean =  writable(true);

import { writable } from 'svelte/store';

// Define the shownavlinks store
const createBooleanVar = (state) => {
  const { subscribe, set } = writable(state);

  return {
    subscribe,
    set
  };
};

export const activePage = writable('home')

export const activeChat = createBooleanVar(false);

export const shownavlinks = createBooleanVar(false);

export const auth = createBooleanVar(false);

export const waitingD = createBooleanVar(true);


// activePage.set("home") 
// let currentPage;
// $: {
//     const page = $activePage;
//     switch (page) {
//         case 'home':
//             currentPage = Home;
//             break;
//         case 'profile':
//             currentPage = Profile;
//             break;
//         case 'leaderboard':
//             currentPage = Leaderboard;
//             break;
//         case 'about':
//             currentPage = About;
//             break;
//         case 'friends':
//             currentPage = Friends;
//             break;
//         default:
//             currentPage = null;
//     }
// }