<!-- Login Page -->
<script>
	import { ApiUrl } from '../../../store/Api';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<a href={`${$ApiUrl}/auth/login`} class="btn variant-filled">Login</a>
	</div>
</div>
