
<script>
    import ponglogo from '$lib/assets/images/ponglogo_big.png';
    import { isAuth } from "../../services/isAuth";
    isAuth();
</script>
<!-- Navbar (you can include your own navigation bar here) -->

<section class="card">
<div class="container mx-auto mt-10 p-4 rounded-lg shadow-lg">
    <h1 class="text-3xl font-semibold  mb-6">About Us</h1>

    <!-- About PongChat Section -->

    <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/2">
            <img src={ponglogo} alt="PongChat Logo" class="rounded-lg w-80">
        </div>
        <div class="md:w-1/2">
            <p class="text-gray-400 text-lg leading-relaxed">
                Welcome to PongChat - Where Classic Meets Social Gaming!
            </p>
            <p class="text-gray-400 text-lg leading-relaxed mt-4">
                At PongChat, we've combined the timeless appeal of the classic Pong game with modern social interaction to create an unforgettable multiplayer gaming experience. Our mission is to bring people together through the joy of gaming and foster connections in an engaging, virtual environment.
            </p>
        </div>
    </div>

    <!-- Our Story Section -->

    <div class="mt-8">
        <h2 class="text-2xl font-semibold ">Our Story</h2>
        <p class="text-gray-400 text-lg leading-relaxed mt-4">
            Founded by a group of passionate gamers in [Year of Establishment], PongChat was born out of a desire to revive the nostalgia of the iconic Pong game and transform it into an interactive, community-driven platform. We believe that gaming should not just be about competing; it should be an opportunity to make friends, chat with people from around the world, and share unforgettable moments.
        </p>
    </div>

    <!-- What Sets Us Apart Section -->

    <div class="mt-8">
        <h2 class="text-2xl font-semibold ">What Sets Us Apart</h2>
        <ul class="list-disc list-inside text-gray-400 text-lg leading-relaxed mt-4">
            <li><strong>Classic Pong with a Twist:</strong> We've stayed true to the classic Pong gameplay that many of us grew up with, but we've added exciting new features and game modes to keep things fresh and exciting.</li>
            <li><strong>Integrated Chat:</strong> Communication is at the heart of our platform. Our integrated chat feature allows you to connect with other players in real-time, making it easy to strategize, celebrate victories, or just have a friendly chat while playing.</li>
            <li><strong>Global Community:</strong> PongChat brings together a diverse community of gamers from all corners of the world. You'll have the chance to challenge opponents from different cultures, making every game a unique experience.</li>
            <li><strong>Tournaments and Events:</strong> Get ready to participate in thrilling tournaments and special events, where you can showcase your Pong skills, win amazing prizes, and earn a spot on our leaderboard.</li>
            <li><strong>User-Focused:</strong> We're constantly listening to our users' feedback to improve the platform. Your suggestions and ideas are invaluable in shaping the future of PongChat.</li>
        </ul>
    </div>

    <!-- Join Us Today Section -->

    <div class="mt-8">
        <h2 class="text-2xl font-semibold ">Join Us Today</h2>
        <p class="text-gray-400 text-lg leading-relaxed mt-4">
            Whether you're a Pong pro or a newbie looking to have some fun, PongChat is the place for you. Come join our growing community, challenge opponents, and engage in lively conversations - all while enjoying the classic game of Pong like never before.
        </p>
        <p class="text-gray-400 text-lg leading-relaxed mt-4">
            Join us on this exciting journey of redefining social gaming through the PongChat experience. Let's paddle, chat, and create memories together!
        </p>
    </div>
</div>
</section>