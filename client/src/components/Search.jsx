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
    })
    .catch(err => {
      console.error("ERROR!!!", err);
    })
  }

  render() {
    return (
      <div className="search">
        <button className="sidebar" onClick={() => {this.props.swapFavorites()}}>{this.props.showFaves ? "Show Results" : "Show Favorites"}</button>
        <br/><br/>

        <form>
          <select className="dropDownId sidebar">
            {this.state.genres.map((genreItem) => {
              return <option key={genreItem.id} value={genreItem.name}>{genreItem.name}</option>
            })}
          </select>
          <br/><br/>
          <input id="submitBtn" className="sidebar" type="submit" name="SUBMITBUTTON" value="Submit" onClick={(e) => {this.props.changeMovieCategory(e)}}/>
        </form>
      </div>
    );
  }
}

export default Search;