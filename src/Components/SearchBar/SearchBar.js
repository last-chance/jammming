import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {

	constructor(props) {
		super(props);

		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);

		this.state ={term: ''};
	} 

	search() {
		this.props.onSearch(this.state.term);
	}

	handleTermChange(event) {
		this.setState({term: event.target.value});
	}

	handleKeyUp(event) {
		if (event.key === 'Enter') {
			this.search();
		}
	}

	render() {
		return (
			<div className="SearchBar">
			  <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}  onKeyUp={this.handleKeyUp}/>
			  <a onClick={this.search}>SEARCH</a>
			</div>
		);
	}

}

export default SearchBar;