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


    let favorites = await movieUtils.getFavorites();
    console.log('All favorites => ', favorites);
    let favorite = await movieUtils.getFavorite(2);
    console.log('ONE favorite => ', favorite);
    let searched = await movieUtils.searchFavorite({genre: 'Comedy'});
    console.log('Searched favorite => ', searched);

})();

import { getFavorites } from './movies.js';


// Add an event listener to the search button
document.getElementById('search-btn').addEventListener('click', searchMovie);

function searchMovie() {
    // Get the search query from the search bar
    const searchQuery = document.getElementById('search-bar').value;

    // Build the API URL with the search query and API key
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIEDC_APPID}&query=${searchQuery}`;

    // Make the API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Get the first movie result from the API response
            const movie = data.results[0];
            console.log(data.results)
            // Create a div to display the movie information
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie-card');

            // Add the movie title to the div
            const titleElement = document.createElement('h2');
            titleElement.innerText = movie.title;
            titleElement.classList.add('movie-title');
            movieDiv.appendChild(titleElement);

            // Add the movie poster to the div
            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const posterElement = document.createElement('img');
            posterElement.src = posterUrl;
            movieDiv.appendChild(posterElement);

            // Add the movie genre(s) to the div
            const genresElement = document.createElement('p');
            const genreNames = movie.genre_ids.map(id => getGenreName(id));
            genresElement.innerText = `Genre: ${genreNames.join(', ')}`;
            genresElement.classList.add('movie-genre');
            movieDiv.appendChild(genresElement);

            // Add the add button, rating label, and select element to the div
            const buttonRow = document.createElement('div');
            buttonRow.classList.add('button', 'row');
            const addButton = document.createElement('button');
            addButton.classList.add('add-btn');
            addButton.innerText = 'Add';
            const ratingLabel = document.createElement('label');
            ratingLabel.setAttribute('for', 'rating');
            ratingLabel.innerText = 'Movie Rating:';
            ratingLabel.classList.add('white-text'); // Add a CSS class to set the font color to white
            const ratingSelect = document.createElement('select');
            ratingSelect.setAttribute('id', 'rating');
            ratingSelect.setAttribute('name', 'rating');
            ratingSelect.classList.add('rating-text'); // Add a CSS class to set the font color to white
            const ratingOption1 = document.createElement('option');
            ratingOption1.setAttribute('value', '1');
            ratingOption1.innerText = '1 star';
            const ratingOption2 = document.createElement('option');
            ratingOption2.setAttribute('value', '2');
            ratingOption2.innerText = '2 stars';
            const ratingOption3 = document.createElement('option');
            ratingOption3.setAttribute('value', '3');
            ratingOption3.innerText = '3 stars';
            const ratingOption4 = document.createElement('option');
            ratingOption4.setAttribute('value', '4');
            ratingOption4.innerText = '4 stars';
            const ratingOption5 = document.createElement('option');
            ratingOption5.setAttribute('value', '5');
            ratingOption5.innerText = '5 stars';
            ratingSelect.appendChild(ratingOption1);
            ratingSelect.appendChild(ratingOption2);
            ratingSelect.appendChild(ratingOption3);
            ratingSelect.appendChild(ratingOption4);
            ratingSelect.appendChild(ratingOption5);
            buttonRow.appendChild(addButton);
            buttonRow.appendChild(ratingLabel);
            buttonRow.appendChild(ratingSelect);
            movieDiv.appendChild(buttonRow);

            addButton.addEventListener('click', addMovie);

            // Add the movie div to the HTML page
            const resultContainer = document.getElementById('result-container');
            resultContainer.innerHTML = '';
            resultContainer.appendChild(movieDiv);
        })
        .catch(error => console.error(error));
}

// Helper function to get genre names from genre IDs
function getGenreName(genreId) {
    switch (genreId) {
        case 28:
            return 'Action';
        case 12:
            return 'Adventure';
        case 16:
            return 'Animation';
        case 35:
            return 'Comedy';
        case 80:
            return 'Crime';
        case 99:
            return 'Documentary';
        case 18:
            return 'Drama';
        case 10751:
            return 'Family';
        case 14:
            return 'Fantasy';
        case 36:
            return 'History';
        case 27:
            return 'Horror';
        case 10402:
            return 'Music';
        case 9648:
            return 'Mystery';
        case 10749:
            return 'Romance';
        case 878:
            return 'Science Fiction';
        case 10770:
            return 'TV Movie';
        case 53:
            return 'Thriller';
        case 10752:
            return 'War';
        case 37:
            return 'Western';
        default:
            return 'Unknown';
    }

}

function addMovie() {
    const title = document.querySelector('.movie-title').textContent;
    const image = document.querySelector('img').src;
    const genre = document.querySelector('.movie-genre').textContent.replace('Genre: ', '').split(', ');
    const rating = document.querySelector('#rating').value;

    const movieData = { title, genre, rating, image };

    fetch('http://localhost:3000/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData)
    })
        .then(response => console.log('Movie added:', movieData))
        .catch(error => console.error(error));
}

const button = document.querySelector('.navbar-library-btn');
const container = document.querySelector('#result-container');

button.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Loop through the movie data and create a new HTML element for each movie
            data.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
                <button class="delete-btn">Delete</button>
                <button class="edit-btn">Edit</button>
                <select id="rating" name="rating">
                  <option value="1">1 star</option>
                  <option value="2">2 stars</option>
                  <option value="3">3 stars</option>
                  <option value="4">4 stars</option>
                  <option value="5">5 stars</option>
                </select>
            </div>
        `;
                container.appendChild(movieElement);
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});
