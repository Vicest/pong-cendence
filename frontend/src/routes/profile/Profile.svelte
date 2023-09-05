<script>
    import { apiData } from "../../services/my42data";

      let apidata;
    apiData.subscribe(data => {
        apidata = data;
        console.log(apidata, apidata.image.versions.medium)

    });

    let showAll = false; // Initially, don't show all items
  let maxItemsToShow = 5; // Number of items to show initially

  function toggleShow() {
    showAll = !showAll;
    maxItemsToShow = showAll ? apidata.achievements.length : 5;
  }
</script>
<style>
    .profile-card{
        width: 80vw;
        /* height:50vh; */
        /* text-align: center; */
    }
    .div-img{
        /* border: 1px solid; */
        width: 100%;
        display: flex;
        justify-content: center;
    }

</style>
<section class="profile-card">
              <div class="card relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg mt-16">
                <div class="px-6 ">
                <div class="flex flex-wrap justify-center">
                  <div class="w-full px-4 flex justify-center">
                    <div class="relative div-img">
                      <img alt="..." src={apidata.image.versions.medium} class="shadow-xl rounded-full h-36 align-middle border-none center -m-16 -ml-20 lg:-ml-16 max-w-150-px">
                    </div>
                  </div>
                  <div class="w-full px-4 text-center mt-20">
                    <div class="flex justify-center py-4 lg:pt-4 pt-8">
                      <div class="mr-4 p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {apidata.projects_users.length}
                        </span>
                        <span class="text-sm text-blueGray-400">Proyects</span>
                      </div>
                      <div class="mr-4 p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {apidata.achievements.length}
                        </span>
                        <span class="text-sm text-blueGray-400">Achivements</span>
                      </div>
                      <div class="lg:mr-4 p-3 text-center">
                        <span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          89
                        </span>
                        <span class="text-sm text-blueGray-400">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-12">
                  <h3 class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {apidata.displayname}
                  </h3>
                  <div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {apidata.campus[0].name}
                  </div>
                  <div class="mb-2 text-blueGray-600 mt-10">
                    <i class="fas fa-star mr-2 text-lg text-blueGray-400"></i>
                    239 points
                  </div>
                  <div class="mb-2 text-blueGray-600">
                    <i class="fas fa-gamepad mr-2 text-lg text-blueGray-400"></i>
                    35 games played
                  </div>
                </div>
                <div class="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <h3 class="text-xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    Achievements
                  </h3>
                  <div class="flex flex-wrap justify-center">
                    <div class="w-full lg:w-9/12 px-4">
                      <p class="mb-4 text-lg leading-relaxed text-blueGray-700">
                        <p>
                          {#each apidata.achievements.slice(0, maxItemsToShow) as achievement, index}
                            {achievement.name} <br>
                          {/each}
                        </p>
                        
                        {#if !showAll}
                          <button class="font-normal text-pink-500" on:click={toggleShow}>
                            Show more
                          </button>
                        {/if}
                        
                        {#if showAll}
                          <button class="font-normal text-pink-500" on:click={toggleShow}>
                            Show less
                          </button>
                        {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <footer class="relative  pt-8 pb-6 mt-8">
            <div class="container mx-auto px-4">
              <div class="flex flex-wrap items-center md:justify-between justify-center">
                <div class="w-full md:w-6/12 px-4 mx-auto text-center">
                  <div class="text-sm text-blueGray-500 font-semibold py-1">
                    Made with <a href="https://www.creative-tim.com/product/notus-js" class="text-blueGray-500 hover:text-gray-800" target="_blank">Notus JS</a> by <a href="https://www.creative-tim.com" class="text-blueGray-500 hover:text-blueGray-800" target="_blank"> Creative Tim</a>.
                  </div>
                </div>
              </div>
            </div>
          </footer>
</section>


<!-- <link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"> -->
<link rel="stylesheet" href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css">
