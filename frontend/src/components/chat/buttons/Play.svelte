<script lang="ts">
	import type { Person } from '$lib/types';
	import { blockUser, userList } from '../../../store/User';
	import { MatchMakingSocket } from '$services/socket';
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	export let user: Person;

    let toastStore = getToastStore();

    function sendChallenge(user: Person) {
        MatchMakingSocket.emit('challenge', {
            opponentId: user.id,
            gameId: 1
        });
        toastStore.trigger({
            message: `You challenged ${user.nickname}`
        });
    }
</script>


{#if userList.areFriends(user.id) && !userList.blockedByMe(user.id)}
    <button class="btn bg-gradient-to-br variant-gradient-secondary-primary rounded-full shadow-lg flex items-center justify-center lg:btn-l btn-md" on:click={() => {
        sendChallenge(user);
    }} disabled={!user}>Play</button>
{/if}
