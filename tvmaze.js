/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.

	const res = await axios.get('https://api.tvmaze.com/search/shows', { params: { q: query } });
	console.log(res.data);
	return createResArray(res.data);
}

//creat the result array;
function createResArray(data) {
	let resArray = [];
	for (let show of data) {
		let showObj = {};
		showObj.id = show.show.id;
		showObj.name = show.show.name;
    showObj.summary = show.show.summary;
    if(show.show.image.medium){
      showObj.image = show.show.image.medium;
    }else{
      showObj.image = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
    }
		
		resArray.push(showObj);
	}
	return resArray;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-4 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}" alt="${show.name}">
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">${show.summary}</p>
            <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#EpisodeModalCenter">Get Episodes!</a>
          </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	let shows = await searchShows(query);

  populateShows(shows);
  
  $('#search-query').val("")
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  return createEpisodeArray(res.data)
}

//create array for episode
function createEpisodeArray(data){
  let resArray = [];
  for(let episode of data){
    let {id,name,season,number}=episode;
    resArray.push({id,name,season,number});
  }
  return resArray;
}

//populate episode list
function populateEpisode(episodes){
  const episodeListModal = document.querySelector('#episodes-list-modal');
  episodeListModal.innerHTML="";
  for(let episode of episodes){
    let newEpisodeEl = document.createElement('li');
    newEpisodeEl.innerHTML= ` ${episode.name} (season: ${episode.season}, number: ${episode.number}) `;
    episodeListModal.appendChild(newEpisodeEl);
  }
}

//Click event for get Episode list
const showList = document.querySelector("#shows-list");
showList.addEventListener("click",async function(e){
  e.preventDefault();
  const target = e.target;
  if(target.classList.contains("btn-primary")){
    changeModalTitle(target);
    let id = target.parentElement.parentElement.getAttribute("data-show-id");
    let episodeList = await getEpisodes(id);
    populateEpisode(episodeList);
  }
})

//Name of the modal
function changeModalTitle(el){
  const name = $(el).siblings(".card-title").text();
  const modalTitle = document.querySelector(".modal-title");
  modalTitle.innerText= name;
}