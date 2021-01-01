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

    // you might have to do something important here!
  }

  componentDidMount() {
    this.getMovies('Comedy');
  }

  getMovies(genre) {
    // make an axios request to your server on the GET SEARCH endpoint
    axios.get('http://localhost:8000/search', { params: {genre} })
    .then(moviesList => {
      this.setState({
        movies: moviesList.data
      })
      console.log('MOVIES IN STATE: ', this.state.movies);
    })
    .catch(err => {
      throw err;
    })
  }

  // When a movie clicked, decides whether to save into favorites (if in main screen) or delete from favorites (if in favorites screen)
  saveOrDeleteMovie(e) {
    if(this.state.showFaves === false) {
      this.saveMovie(e);
    } else {
      this.deleteMovie(e);
    }
  }

  // If movie not already favorited (checks database), favorites it and puts in database.
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
    .then(() => {
      alert('Movie Favorited!');
    })
    .catch((err) => {
      throw err;
    })
  }

  // If movie favorited (checks database), deletes it from database.
  deleteMovie() {
    // same as above but do something diff
    console.log('DELETE MOVIE');
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