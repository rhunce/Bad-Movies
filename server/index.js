var express = require("express");
var bodyParser = require("body-parser");
var axios = require('axios');
var { API_KEY } = require('../config.js');
var db = require('../db/sql/index.js');

var app = express();
app.listen(8000); // ADDED

//Helpers
var apiHelpers = require("./helpers/apiHelpers.js");

//Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.set({
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
    'Content-Type': 'application/json'
  });
  next();
}); // ADDED

// Due to express, when you load the page, it doesn't make a get request to '/', it simply serves up the dist folder
app.use(express.static(__dirname + "/../client/dist"));

// ROUTES: Takes requests from user (who operates in the browser) and routes request to TMDb API.
// Result: Respond with JSON of all genres
app.get("/genres", function(req, res) {
  axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
  .then((genreResult) => {
    res
      .set('Content-Type', 'application/json')
      .status(200)
      .json(genreResult.data.genres);
  })
  .catch((err) => {
    console.log('GET /genres ERROR: ', err);
  })
});

// Result: Respond with JSON of all movies by the selected genre
// Will have to send with a req.body - i.e. { "genre": "Comedy" }
app.get("/search", function(req, res) {
  console.log('REQ-QUERY: ', req.query);
  var genres = { Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80, Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36, Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, "Science Fiction": 878, "TV Movie": 10770, Thriller: 53, War: 10752, Western: 37 }
  var GENRE = genres[req.query.genre];
  var getURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.asc&vote_count.gte=10&with_genres=${GENRE}&with_original_language=en`;

  axios.get(getURL)
  .then((filteredAndSortedMoviesResult) => {
    res
      .set('Content-Type', 'application/json')
      .status(200)
      .json(filteredAndSortedMoviesResult.data.results);
  })
  .catch((err) => {
    console.log('GET /search ERROR: ', err);
  })
});

// Result: Respond with JSON of all movies in favorites in database.
app.get("/favorites", function(req, res) {
  db.getFavorites((favoritesData) => {
    res
      .set('Content-Type', 'application/json')
      .status(200)
      .json(favoritesData);
  })
});

// Result: Save selected movie as favorite into the database
app.post("/save", function(req, res) {
  var poster_path = req.body.poster_path;
  var title = req.body.title;
  var release_date = req.body.release_date;
  var vote_average = req.body.vote_average;

  var params = [poster_path, title, release_date, vote_average]
  db.saveMovie(params, (movieData) => {
    res
      .set('Content-Type', 'application/json')
      .status(201)
      .end(JSON.stringify({
        poster_path,
        title,
        release_date,
        vote_average
      }));
  });
});

// Result: Remove selected movie as favorite in database
app.post("/delete", function(req, res) {
  var title = req.body.title;
  var params = [title];
  db.deleteMovie(params, () => {
    res
      .set('Content-Type', 'application/json')
      .status(201)
      .end('Movie Deleted From Favorites');
  });
});