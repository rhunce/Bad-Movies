-- SCHEMA SET UP

DROP DATABASE badmovies;

CREATE DATABASE badmovies;

USE badmovies;

CREATE TABLE favorited_movies (
  id INT AUTO_INCREMENT,
  image_path VARCHAR(250),
  movie_title VARCHAR(250),
  release_date VARCHAR(250),
  average_rating VARCHAR(250),
  PRIMARY KEY(id)
);

