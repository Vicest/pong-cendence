
<script>
    import logo42 from '$lib/assets/images/logo42.png';
    const apiBaseUrl = "http://localhost:3000";

</script>
<style>
    @import 'login.css';
  
</style>
<div class="justify-content-center fadeInDown">
    <div id="formContent">
        <div class="fadeIn first">
        <img src={logo42} id="icon" alt="User Icon" />
        </div>
        <div id="formFooter">
        <a href={`${apiBaseUrl}/login`} class="underlineHover"> Login </a>
        </div>
    </div>
</div>