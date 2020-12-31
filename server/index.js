var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var axios = require('axios'); // I IMPORTED THIS. SEEMS I CAN USE THIS IN PLACE OF REQUIRE.
var { API_KEY } = require('../config.js'); // I IMPORTED THIS TO ACCESS API KEY.
// api_key=3e2a09eb6f5524b4b00b190b8f767a0d
var db = require('../db/sql/index.js');

var app = express();
app.listen(8000); // I ADDED THIS

//Helpers
var apiHelpers = require("./helpers/apiHelpers.js");

//Middleware
app.use(bodyParser.json());

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
  var genres = { Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80, Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36, Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, "Science Fiction": 878, "TV Movie": 10770, Thriller: 53, War: 10752, Western: 37 }

  var GENRE = genres[req.body.genre];

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

// Result: Save selected movie as favorite into the database
// Will have to send with a req.body - i.e.:
/*{
  "poster_path": "/vezdMXYQJmA4OTczOCIagQUwsTP.jpg",
  "title": "Saving Christmas",
  "release_date": "2012-06-15",
  "vote_average": 1.8
}*/
app.post("/save", function(req, res) {
  var imagePath = req.body.poster_path;
  var title = req.body.title;
  var releaseDate = req.body.release_date.substring(0, 4);
  var rating = req.body.vote_average;

  var params = [imagePath, title, releaseDate, rating]
  db.saveMovie(params, () => {
    res
      .set('Content-Type', 'application/json')
      .status(201)
      .end('Movie Added To Favorites');
  });
});

// Result: Remove selected movie as favorite in database
// Will have to send with a req.body - i.e. { "title": "Saving Christmas" }
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