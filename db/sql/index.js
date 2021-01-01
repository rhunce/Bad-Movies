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
  const queryStr = 'SELECT EXISTS(SELECT * FROM favorited_movies WHERE image_path = ?)';
  connection.query(queryStr, params, (error, results, fields) => {
    const movieAlreadyFavorited = Object.values(results[0])[0] === 1;
    if (error) {
      throw error;
    } else if (movieAlreadyFavorited) {
      return;
    } else {
      const queryStr = 'INSERT INTO favorited_movies (image_path, movie_title, release_date, average_rating) VALUES (?, ?, ?, ?)';
      connection.query(queryStr, params, (error, results, fields) => {
        if (error) {
          throw error;
        } else {
          callback();
        }
      })
    }
  })
}

const deleteMovie = (params, callback) => {
  const queryStr = 'DELETE FROM favorited_movies WHERE movie_title = ?';
  connection.query(queryStr, params, (error, results, fields) => {
    if (error) {
      throw error;
    } else {
      callback();
    }
  })
}

module.exports = {
  saveMovie,
  deleteMovie
};