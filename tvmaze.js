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
	let movieArr = [];
	const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

	for (let movie of res.data) {
		const { id, name, summary, image } = movie.show;
		let emptyImg = jQuery.isEmptyObject(image);
		let url;

		if (emptyImg) {
			url =
				'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300';
		} else {
			url = image.original;
		}

		movieArr.push({ id, name, summary, image: url });
	}

	return movieArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body" data-show-id="${show.id}">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src="${show.image}">
             <p class="card-text">${show.summary}</p>
			<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#episodeBtn">
			Episodes
			</button>
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
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

$('#shows-list').on('click', async function handleEpisodes(e) {
	if (e.target.tagName === 'BUTTON') {
		const $id = $(e.target).closest('div').data('show-id');

		let episodes = await getEpisodes($id);
		populateEpisodes(episodes);
	}
});

async function getEpisodes(showId) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	let episodesArr = [];

	const res = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);

	for (let episode of res.data) {
		const { id, name, season, number } = episode;
		episodesArr.push({ id, name, season, number });
	}

	return episodesArr;
}

async function populateEpisodes(episodes) {
	const $ul = $('#episodes-list');
	$ul.empty();

	for (let episode of episodes) {
		const $li = $(`<li><b>${episode.name}</b> - (season ${episode.season}, episode ${episode.number})</li>`);
		$ul.append($li);
	}
}
