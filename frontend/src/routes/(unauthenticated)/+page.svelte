<!-- Login Page -->
<script>
	import { ApiUrl } from '../../store/Common';
</script>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Welcome to our game</h2>
		<a class="btn variant-filled" href={`${$ApiUrl}/auth/login`}>Login</a>
	</div>
</div>
