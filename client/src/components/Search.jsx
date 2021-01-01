import React from 'react';
import axios from 'axios';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      genres: []
    };
  }

  componentDidMount() {
    this.getGenres();
  }

  getGenres() {
    axios.get('http://localhost:8000/genres')
    .then(genreList => {
      this.setState({
        genres: genreList.data
      })
      // console.log('STATE: ', this.state.genres);
    })
    .catch(err => {
      console.error("ERROR!!!", err);
    })
  }

  render() {
    return (
      <div className="search">
        <button onClick={() => {this.props.swapFavorites()}}>{this.props.showFaves ? "Show Results" : "Show Favorites"}</button>
        <br/><br/>

        {/* Make the select options dynamic from genres !!! */}
        {/* How can you tell which option has been selected from here? */}

        <select>
          {this.state.genres.map((genreItem) => {
            return <option key={genreItem.id}>{genreItem.name}</option>
          })}
        </select>
        <br/><br/>

        <button>Search</button>

      </div>
    );
  }
}

export default Search;