-- SCHEMA SET UP

DROP DATABASE badmovies;

CREATE DATABASE badmovies;

USE badmovies;

CREATE TABLE favorited_movies (
  id INT AUTO_INCREMENT,
  poster_path VARCHAR(250),
  title VARCHAR(250),
  release_date VARCHAR(250),
  vote_average VARCHAR(250),
  PRIMARY KEY(id)
);

