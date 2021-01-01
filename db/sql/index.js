const mysql = require('mysql');
const mysqlConfig = require('../../config.js');

const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

const saveMovie = (params, callback) => {
  const queryStr = 'SELECT EXISTS(SELECT * FROM favorited_movies WHERE poster_path = ?)';
  connection.query(queryStr, params, (error, results, fields) => {
    const movieAlreadyFavorited = Object.values(results[0])[0] === 1;
    if (error) {
      throw error;
    } else if (movieAlreadyFavorited) {
      return;
    } else {
      const queryStr = 'INSERT INTO favorited_movies (poster_path, title, release_date, vote_average) VALUES (?, ?, ?, ?)';
      connection.query(queryStr, params, (error, results, fields) => {
        if (error) {
          throw error;
        } else {
          callback(params);
        }
      })
    }
  })
}

const deleteMovie = (params, callback) => {
  const queryStr = 'DELETE FROM favorited_movies WHERE title = ?';
  connection.query(queryStr, params, (error, results, fields) => {
    if (error) {
      throw error;
    } else {
      callback();
    }
  })
}

const getFavorites = (callback) => {
  const queryStr = 'SELECT * FROM favorited_movies';
  connection.query(queryStr, (error, results, fields) => {
    if (error) {
      throw error;
    } else {
      callback(results);
    }
  })
}

module.exports = {
  saveMovie,
  deleteMovie,
  getFavorites
};