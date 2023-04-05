import * as movieUtils from './movies.js'

(async()=>{

    // document.querySelector('button').addEventListener('click', async function(){
    //     const title = document.querySelector('#title').value;
    //     const genre = document.querySelector('#genre').value;
    //     const rating = parseFloat(document.querySelector('#rating').value);
    //     let movieData = {
    //         title,
    //         genre,
    //         rating
    //     }
    //     let result = await movieUtils.setFavorite(movieData);
    //     console.log(result);
    // });


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
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_DB_ID}&query=${searchQuery}`;

    // Make the API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Get the first movie result from the API response
            let movie = data.results[0];
            console.log(movie);
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
                genresElement.innerText = `Genre: ${genreNames.slice(0,2).join(', ')}`;
                genresElement.classList.add('movie-genre');
                movieDiv.appendChild(genresElement);

                // Add the add button, rating label, and select element to the div
                const buttonRow = document.createElement('div');
                buttonRow.classList.add('button-row');
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

                document.getElementById('result-container').innerHTML = '';

                // Add the movie div to the HTML page
                const resultContainer = document.getElementById('result-container');
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
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listener to the "Delete" button
                const deleteBtn = movieElement.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    const movieId = deleteBtn.getAttribute('data-id');
                    fetch(`http://localhost:3000/favorites/${movieId}`, {
                        method: 'DELETE'
                    })
                        .then(() => {
                            // Remove the individual movie element from the page
                            movieElement.remove();
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                // Add event listener to the "Edit" button
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');
                editBtn.addEventListener('click', () => {
                    const movieId = deleteBtn.getAttribute('data-id');
                    const newRating = ratingSelect.value;
                    fetch(`http://localhost:3000/favorites/${movieId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ rating: newRating })
                    })
                        .then(() => {
                            // Reset the rating of the individual movie element
                            const libraryRating = movieElement.querySelector('.library-rating');
                            libraryRating.textContent = `Rating: ${newRating}`;
                        })
                        .catch(error => {
                            console.error('Error updating rating:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});

window.addEventListener('load', () => {
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
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listener to the "Delete" button
                const deleteBtn = movieElement.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    const movieId = deleteBtn.getAttribute('data-id');
                    fetch(`http://localhost:3000/favorites/${movieId}`, {
                        method: 'DELETE'
                    })
                        .then(() => {
                            // Remove the individual movie element from the page
                            movieElement.remove();
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                // Add event listener to the "Edit" button
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');
                editBtn.addEventListener('click', () => {
                    const movieId = deleteBtn.getAttribute('data-id');
                    const newRating = ratingSelect.value;
                    fetch(`http://localhost:3000/favorites/${movieId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ rating: newRating })
                    })
                        .then(() => {
                            // Reset the rating of the individual movie element
                            const libraryRating = movieElement.querySelector('.library-rating');
                            libraryRating.textContent = `Rating: ${newRating}`;
                        })
                        .catch(error => {
                            console.error('Error updating rating:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});

const button1 = document.querySelector('#drama');

button1.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Filter the movie data to only include those with a genre of "Drama"
            const dramaMovies = data.filter(movie => {
                return Array.isArray(movie.genre) ? movie.genre.includes('Drama') : movie.genre === 'Drama';
            });

            // Loop through the filtered array and create a new HTML element for each movie
            dramaMovies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listeners to the delete and edit buttons for each movie element
                const deleteBtn = movieElement.querySelector('.delete-btn');
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');

                deleteBtn.addEventListener('click', () => {
                    // Remove the movie element from the DOM
                    movieElement.remove();

                    // Send a DELETE request to the server to delete the movie from the database
                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie deleted:', data);
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                editBtn.addEventListener('click', () => {
                    // Update the rating of the movie element and send a PUT request to the server to update the rating in the database
                    movie.rating = ratingSelect.value;
                    const libraryRating = movieElement.querySelector('.library-rating');
                    libraryRating.textContent = `Rating: ${movie.rating}`;

                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie updated:', data);
                        })
                        .catch(error => {
                            console.error('Error updating movie:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});


const button2 = document.querySelector('#comedy');

button2.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Filter the movie data to only include those with a genre of "Drama"
            const dramaMovies = data.filter(movie => {
                return Array.isArray(movie.genre) ? movie.genre.includes('Comedy') : movie.genre === 'Comedy';
            });

            // Loop through the filtered array and create a new HTML element for each movie
            dramaMovies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listeners to the delete and edit buttons for each movie element
                const deleteBtn = movieElement.querySelector('.delete-btn');
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');

                deleteBtn.addEventListener('click', () => {
                    // Remove the movie element from the DOM
                    movieElement.remove();

                    // Send a DELETE request to the server to delete the movie from the database
                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie deleted:', data);
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                editBtn.addEventListener('click', () => {
                    // Update the rating of the movie element and send a PUT request to the server to update the rating in the database
                    movie.rating = ratingSelect.value;
                    const libraryRating = movieElement.querySelector('.library-rating');
                    libraryRating.textContent = `Rating: ${movie.rating}`;

                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie updated:', data);
                        })
                        .catch(error => {
                            console.error('Error updating movie:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});

const button3 = document.querySelector('#action');

button3.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Filter the movie data to only include those with a genre of "Drama"
            const dramaMovies = data.filter(movie => {
                return Array.isArray(movie.genre) ? movie.genre.includes('Action') : movie.genre === 'Action';
            });

            // Loop through the filtered array and create a new HTML element for each movie
            dramaMovies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listeners to the delete and edit buttons for each movie element
                const deleteBtn = movieElement.querySelector('.delete-btn');
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');

                deleteBtn.addEventListener('click', () => {
                    // Remove the movie element from the DOM
                    movieElement.remove();

                    // Send a DELETE request to the server to delete the movie from the database
                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie deleted:', data);
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                editBtn.addEventListener('click', () => {
                    // Update the rating of the movie element and send a PUT request to the server to update the rating in the database
                    movie.rating = ratingSelect.value;
                    const libraryRating = movieElement.querySelector('.library-rating');
                    libraryRating.textContent = `Rating: ${movie.rating}`;

                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie updated:', data);
                        })
                        .catch(error => {
                            console.error('Error updating movie:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});

const button4 = document.querySelector('#science-fiction');

button4.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Filter the movie data to only include those with a genre of "Science Fiction"
            const dramaMovies = data.filter(movie => {
                return Array.isArray(movie.genre) ? movie.genre.includes('Science Fiction') : movie.genre === 'Science Fiction';
            });

            // Loop through the filtered array and create a new HTML element for each movie
            dramaMovies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listeners to the delete and edit buttons for each movie element
                const deleteBtn = movieElement.querySelector('.delete-btn');
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');

                deleteBtn.addEventListener('click', () => {
                    // Remove the movie element from the DOM
                    movieElement.remove();

                    // Send a DELETE request to the server to delete the movie from the database
                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie deleted:', data);
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                editBtn.addEventListener('click', () => {
                    // Update the rating of the movie element and send a PUT request to the server to update the rating in the database
                    movie.rating = ratingSelect.value;
                    const libraryRating = movieElement.querySelector('.library-rating');
                    libraryRating.textContent = `Rating: ${movie.rating}`;

                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie updated:', data);
                        })
                        .catch(error => {
                            console.error('Error updating movie:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});


const button5 = document.querySelector('#animation');

button5.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Filter the movie data to only include those with a genre of "Animation"
            const dramaMovies = data.filter(movie => {
                return Array.isArray(movie.genre) ? movie.genre.includes('Animation') : movie.genre === 'Animation';
            });

            // Loop through the filtered array and create a new HTML element for each movie
            dramaMovies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listeners to the delete and edit buttons for each movie element
                const deleteBtn = movieElement.querySelector('.delete-btn');
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');

                deleteBtn.addEventListener('click', () => {
                    // Remove the movie element from the DOM
                    movieElement.remove();

                    // Send a DELETE request to the server to delete the movie from the database
                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie deleted:', data);
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                editBtn.addEventListener('click', () => {
                    // Update the rating of the movie element and send a PUT request to the server to update the rating in the database
                    movie.rating = ratingSelect.value;
                    const libraryRating = movieElement.querySelector('.library-rating');
                    libraryRating.textContent = `Rating: ${movie.rating}`;

                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie updated:', data);
                        })
                        .catch(error => {
                            console.error('Error updating movie:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});

const button6 = document.querySelector('#fantasy');

button6.addEventListener('click', () => {
    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Clear the container first
            container.innerHTML = '';

            // Filter the movie data to only include those with a genre of "Fantasy"
            const dramaMovies = data.filter(movie => {
                return Array.isArray(movie.genre) ? movie.genre.includes('Fantasy') : movie.genre === 'Fantasy';
            });

            // Loop through the filtered array and create a new HTML element for each movie
            dramaMovies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie-card');
                movieElement.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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

                // Add event listeners to the delete and edit buttons for each movie element
                const deleteBtn = movieElement.querySelector('.delete-btn');
                const editBtn = movieElement.querySelector('.edit-btn');
                const ratingSelect = movieElement.querySelector('#rating');

                deleteBtn.addEventListener('click', () => {
                    // Remove the movie element from the DOM
                    movieElement.remove();

                    // Send a DELETE request to the server to delete the movie from the database
                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie deleted:', data);
                        })
                        .catch(error => {
                            console.error('Error deleting movie:', error);
                        });
                });

                editBtn.addEventListener('click', () => {
                    // Update the rating of the movie element and send a PUT request to the server to update the rating in the database
                    movie.rating = ratingSelect.value;
                    const libraryRating = movieElement.querySelector('.library-rating');
                    libraryRating.textContent = `Rating: ${movie.rating}`;

                    fetch(`http://localhost:3000/favorites/${movie.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Movie updated:', data);
                        })
                        .catch(error => {
                            console.error('Error updating movie:', error);
                        });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});



// const searchBar = document.querySelector('.search-favorites');
// const searchBtn = document.querySelector('#favorite-search-btn');
// searchBtn.addEventListener('click', () => {
//     const searchValue = searchBar.value.toLowerCase().trim();
//
//     fetch('http://localhost:3000/favorites')
//         .then(response => response.json())
//         .then(data => {
//             // Clear the container first
//             container.innerHTML = '';
//
//             // Filter the movie data based on the search value
//             const filteredData = data.filter(movie => {
//                 return movie.title.toLowerCase().includes(searchValue);
//             });
//
//             // If no movies were found, display a message
//             if (filteredData.length === 0) {
//                 const noResult = document.createElement('p');
//                 noResult.innerText = 'No movie found';
//                 container.appendChild(noResult);
//                 return;
//             }
//
//             // Loop through the filtered movie data and create a new HTML element for each movie
//             filteredData.forEach(movie => {
//                 const movieCard = document.createElement('div');
//                 movieCard.classList.add('movie-card');
//                 movieCard.innerHTML = `
//           <h2 class="movie-title">${movie.title}</h2>
//           <img src="${movie.image}" alt="${movie.title}">
//           <p class="movie-genre">Genre: ${movie.genre}</p>
//           <p class="library-rating">Rating: ${movie.rating}</p>
//           <div class="button-row">
//             <button class="delete-btn" data-id="${movie.id}">Delete</button>
//             <button class="edit-btn">Edit</button>
//             <select id="rating" name="rating">
//               <option value="1">1 star</option>
//               <option value="2">2 stars</option>
//               <option value="3">3 stars</option>
//               <option value="4">4 stars</option>
//               <option value="5">5 stars</option>
//             </select>
//           </div>
//         `;
//                 container.appendChild(movieCard);
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching movie data:', error);
//         });
// });

const searchBar = document.querySelector('.search-favorites');
const searchBtn = document.querySelector('#favorite-search-btn');

// Function to refresh the movie list with the provided data
function refreshMovieList(movies) {
    // Clear the container first
    container.innerHTML = '';

    // If no movies were found, display a message
    if (movies.length === 0) {
        const noResult = document.createElement('p');
        noResult.innerText = 'No movie found';
        container.appendChild(noResult);
        return;
    }

    // Loop through the filtered movie data and create a new HTML element for each movie
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
          <h2 class="movie-title">${movie.title}</h2>
          <img src="${movie.image}" alt="${movie.title}">
          <p class="movie-genre">Genre: ${movie.genre}</p>
          <p class="library-rating">Rating: ${movie.rating}</p>
          <div class="button-row">
            <button class="delete-btn" data-id="${movie.id}">Delete</button>
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
        container.appendChild(movieCard);

        // Add event listener to delete button
        const deleteButton = movieCard.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/favorites/${movie.id}`, {
                method: 'DELETE'
            })
                .then(() => {
                    movieCard.remove();
                })
                .catch(error => {
                    console.error('Error deleting movie:', error);
                });
        });

        // Add event listener to edit button
        const editButton = movieCard.querySelector('.edit-btn');
        editButton.addEventListener('click', () => {
            const ratingSelect = movieCard.querySelector('#rating');
            const newRating = ratingSelect.value;
            fetch(`http://localhost:3000/favorites/${movie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating: newRating })
            })
                .then(() => {
                    // Update the movie's rating in the UI
                    const ratingElement = movieCard.querySelector('.library-rating');
                    ratingElement.textContent = `Rating: ${newRating}`;
                })
                .catch(error => {
                    console.error('Error updating movie:', error);
                });
        });
    });
}

searchBtn.addEventListener('click', () => {
    const searchValue = searchBar.value.toLowerCase().trim();

    fetch('http://localhost:3000/favorites')
        .then(response => response.json())
        .then(data => {
            // Filter the movie data based on the search value
            const filteredData = data.filter(movie => {
                return movie.title.toLowerCase().includes(searchValue);
            });

            // Refresh the movie list with the filtered data
            refreshMovieList(filteredData);
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
});

const addMovieForm = `
  <form id="add-movie-form">
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" required>
    <label for="genre">Genre:</label>
    <input type="text" id="genre" name="genre" required>
    <label for="rating">Rating:</label>
    <input type="number" id="rating" name="rating" min="1" max="5" required>
    <button type="submit">Add Movie</button>
  </form>
`;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#result-container');
    const addMovieForm = `
          <form id="add-movie-form">
            <label id="home-movie-title" for="home-movie-title">Title:</label>
            <input type="text" id="title" name="title" required>
            <label id="home-movie-title" for="home-movie-genre">Genre:</label>
            <input type="text" id="genre" name="genre" required>
            <label id="home-movie-title" for="home-movie-rating">Rating:</label>
            <input type="number" id="rating" name="rating" min="1" max="5" required>
            <button id="home-movie-submit" type="home-movie-submit">Submit Movie</button>
          </form>
        `;

    const addHomeMovie = () => {
        container.innerHTML = addMovieForm;

        const form = document.querySelector('#add-movie-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.querySelector('#title').value;
            const genre = document.querySelector('#genre').value;
            const rating = document.querySelector('#rating').value;

            // Add the movie data to the database
            fetch('http://localhost:3000/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    genre,
                    rating,
                    image: '/images/vhs.jpg'
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('New movie added:', data);
                    container.innerHTML = `<p>New movie added: ${data.title}</p>`;
                })
                .catch(error => {
                    console.error('Error adding movie:', error);
                    container.innerHTML = `<p>Error adding movie: ${error.message}</p>`;
                });
        });
    };

    const homeMovieBtn = document.querySelector('.navbar-home-movie-btn');
    homeMovieBtn.addEventListener('click', addHomeMovie);
});

let loaderContainer = document.querySelector('.loader-container');
window.addEventListener('load', () => {
    setTimeout(function(){
        loaderContainer.classList.add('loader-container-hidden');
    }, 2000)
});

document.querySelector('.navbar-header').addEventListener('click', ()=> {
    document.querySelector('.navbar').classList.toggle('hidden');
    document.querySelector('.opener').classList.toggle('hidden');
})

document.querySelector('.opener').addEventListener('click', ()=> {
    document.querySelector('.opener').classList.toggle('hidden');
    document.querySelector('.navbar').classList.toggle('hidden');
})