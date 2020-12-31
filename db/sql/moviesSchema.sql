-- SCHEMA SET UP

DROP DATABASE badmovies;

CREATE DATABASE badmovies;

USE badmovies;

CREATE TABLE favorited_movies (
  id INT AUTO_INCREMENT,
  favorited_movie VARCHAR(250),
  PRIMARY KEY(id)
);