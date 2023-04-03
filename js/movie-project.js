import * as movieUtils from './movies.js'

(async()=>{

    document.querySelector('button').addEventListener('click', async function(){
        const title = document.querySelector('#title').value;
        const genre = document.querySelector('#genre').value;
        const rating = parseFloat(document.querySelector('#rating').value);
        let movieData = {
            title,
            genre,
            rating
        }
        let result = await movieUtils.setFavorite(movieData);
        console.log(result);
    });

    // let body = {
    //     "rating": 3
    // }
    // let response = await patchFavorite(4, body);
    // await deleteFavorite(4);

    let favorites = await movieUtils.getFavorites();
    console.log('All favorites => ', favorites);
    let favorite = await movieUtils.getFavorite(2);
    console.log('ONE favorite => ', favorite);
    let searched = await movieUtils.searchFavorite({genre: 'Comedy'});
    console.log('Searched favorite => ', searched);

})();

import { getFavorites } from './movies.js';

const movieContainer = document.getElementById('movie-container');

const displayMovies = async () => {
    const data = await movieUtils.getFavorites();
    const movies = data.favorites;
    const movieCards = movies.map(movie => {
        return `
      <div class="card">
        <img src="${movie.image}" alt="${movie.title}">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">${movie.genre}</p>
          <p class="card-text">${movie.rating}/5</p>
        </div>
      </div>
    `;
    });
    movieContainer.innerHTML = movieCards.join('');
};

displayMovies();
