import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state = {
    //  searchResults: [{id: 1, name: 'Boogie-Woogie', album: 'She-Bop', artist: 'The Geezers', uri: 'foo'}, {id: 2, name: 'Humpty-Dumpty', album: 'Huge Falls', artist: 'Child\'s Play', uri: 'bar'}, {id: 3, name: 'Timey-Wimey', album: 'Around Again', artist: 'Baker\'s Dozen', uri: 'foobar'}],
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
  }

  search(term) {
    Spotify.search(term).then( (searchResponse) => {
      this.setState({searchResults: searchResponse});
    });
  }

  addTrack(track) {
    if (this.state.playlistTracks.find((playlistTrack) => playlistTrack.id === track.id)) {
      return;
    } else {
      const newPlaylist = this.state.playlistTracks.concat(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track) {
    const newPlaylist = this.state.playlistTracks.filter((playlistTrack) => playlistTrack.id !== track.id);
    this.setState({playlistTracks: newPlaylist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((playlistTrack) => {return playlistTrack.uri});
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistTracks: []});
    this.setState({playlistName: 'New Playlist'});
  }

  render() {
    return (
     <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search} />
        <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
        <Playlist playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;