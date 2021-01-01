import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import Search from './components/Search.jsx';
import Movies from './components/Movies.jsx';

class App extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
      movies: [],
      favorites: [],
      showFaves: false
    };
  }

  componentDidMount() {
    this.getMovies('Action');
    this.populateFavorites();
  }

  getMovies(genre) {
    // make an axios request to your server on the GET SEARCH endpoint
    axios.get('http://localhost:8000/search', { params: {genre} })
    .then(moviesList => {
      this.setState({
        movies: moviesList.data
      })
      console.log('MOVIES: ', this.state.movies);
    })
    .catch(err => {
      throw err;
    })
  }

  populateFavorites() {
    axios.get('http://localhost:8000/favorites')
    .then((favoritedMovieData) => {
      this.setState({
        favorites: favoritedMovieData.data
      })
      console.log('FAVORITED MOVIES: ', this.state.favorites);
    })
    .catch((err) => {
      throw err;
    });
  }

  // When a movie clicked, decides whether to save into favorites (if in main screen) or delete from favorites (if in favorites screen)
  saveOrDeleteMovie(e) {
    if(this.state.showFaves === false) {
      this.saveMovie(e);
    } else {
      this.deleteMovie(e);
    }
  }

  // If movie not already favorited (checks database), favorites it by putting in database and then adding to this.state.favorites.
  saveMovie(e) {
    var neededInfo = e.currentTarget.getElementsByClassName('needed_info');

    var poster_path = neededInfo[0].src.substring(31);
    var title = neededInfo[1].innerText;
    var release_date = neededInfo[2].innerText;
    var vote_average = neededInfo[3].innerText;

    axios.post('http://localhost:8000/save', {
      poster_path,
      title,
      release_date,
      vote_average
    })
    .then((movieData) => {
      var args = this.state.favorites;
      this.setState({
        favorites: [...args, movieData.data]
      })
    })
    .then(() => {
      console.log('FAVORITES: ', this.state.favorites);
    })
    .catch((err) => {
      throw err;
    })
  }

  // If movie favorited (checks database), deletes it from database.
  deleteMovie(e) {
    var neededInfo = e.currentTarget.getElementsByClassName('needed_info');
    var title = neededInfo[1].innerText;

    axios.post('http://localhost:8000/delete', {
      title
    })
    .then((movieData) => {
      this.populateFavorites();
    })
    .catch((err) => {
      throw err;
    })
  }

  changeMovieCategory(e) {
    e.preventDefault();
    var categorySelected = document.getElementsByClassName("dropDownId")[0].value;
    console.log('categorySelected: ', categorySelected);
    this.getMovies(categorySelected);
  }

  swapFavorites() {
  // don't touch
    this.setState({
      showFaves: !this.state.showFaves
    });
  }

  render () {
  	return (
      <div className="app">
        <header className="navbar"><h1>Bad Movies</h1></header>

        <div className="main">
          <Search
            swapFavorites={this.swapFavorites.bind(this)}
            showFaves={this.state.showFaves}
            changeMovieCategory={this.changeMovieCategory.bind(this)}
          />
          <Movies
            movies={this.state.showFaves ? this.state.favorites : this.state.movies}
            showFaves={this.state.showFaves}
            saveOrDeleteMovie={this.saveOrDeleteMovie.bind(this)}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));