import React from 'react';

class Movies extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ul className="movies">
        {this.props.movies.map(movie => {
        return (<li key={movie.id} className="movie_item" onClick={(e) => {this.props.saveOrDeleteMovie(e)}}>
          <img className="needed_info" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
          <div className="movie_description">
            <h2 className="needed_info">{movie.title}</h2>
            <section className="movie_details">
              <div className="movie_year">
                <span className="title">Year</span>
                <span className="needed_info">{movie.release_date.substring(0, 4)}</span>
              </div>
              <div className="movie_rating">
                <span className="title">Rating</span>
                <span className="needed_info">{movie.vote_average}</span>
              </div>
            </section>
          </div>
        </li>)
        })}
      </ul>
    );
  }
}

export default Movies;