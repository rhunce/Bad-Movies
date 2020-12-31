var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var axios = require('axios'); // I IMPORTED THIS. SEEMS I CAN USE THIS IN PLACE OF REQUIRE.
var { API_KEY } = require('../config.js'); // I IMPORTED THIS TO ACCESS API KEY.

var app = express();
app.listen(8000); // I ADDED THIS

//Helpers
var apiHelpers = require("./helpers/apiHelpers.js");

//Middleware
app.use(bodyParser.json());

// Due to express, when you load the page, it doesn't make a get request to '/', it simply serves up the dist folder
app.use(express.static(__dirname + "/../client/dist"));

// USE THESE ROUTES TO BUILD THE APPLICATION:

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
app.get("/search", function(req, res) {
  var genres = { Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80, Documentary: 99, Drama: 18, Family: 10751, Fantasy: 14, History: 36, Horror: 27, Music: 10402, Mystery: 9648, Romance: 10749, "Science Fiction": 878, "TV Movie": 10770, Thriller: 53, War: 10752, Western: 37 }

  // will have to define req.body elsewhere
  // req.body.genre = <Genre_Selected> --> req.body = { genre: <Genre_Selected> }
  var GENRE = genres[req.body.genre];
  // console.log('GENRE: ', GENRE);

  var getURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.asc&vote_count.gte=10&with_genres=${GENRE}&with_original_language=en`;

  axios.get(getURL)
  // do NOT save the results into the database; render results directly on the page
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

// Result: Save selected movie as favorite
app.post("/save", function(req, res) {
  //save movie as favorite into the database
});

// Result: Remove selected movie as favorite
app.post("/delete", function(req, res) {
  //remove movie from favorites into the database
});