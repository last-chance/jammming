const Spotify = {

	accessToken: '',
	clientID: '5da090fbc7da44bda04dd1429f35561e',
	redirectURI: 'http://cmnjamming.surge.sh/',

	getAccessToken() {

		// Return the accessToken, if one currently exists
		if (this.accessToken !== '') {
			return this.accessToken;
		} 

		// Get the access token from the current URL, if one exists
		else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
			this.accessToken = window.location.href.match(/access_token=([^&]*)/)[0].substring(13);
			let tokenExpires = window.location.href.match(/expires_in=([^&]*)/)[0].substring(11);
			window.setTimeout(() => {this.accessToken = ''}, tokenExpires * 1000);
			window.history.pushState('Access Token', null, '/');
			return this.accessToken;
		} 

		// Redirect to get a new token, if none exists in accessToken or the URL
		else {
			window.location = `https://accounts.spotify.com/authorize?client_id=${this.clientID}&response_type=token&scope=playlist-modify-private&redirect_uri=${this.redirectURI}`;
		}

	}, 

	search(term) {

		// Search Spotify using the current accessToken
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {method: 'GET', 'headers': {Authorization: `Bearer ${this.getAccessToken()}`}}).then( (response) => {
			if (response.ok) {
				return response.json();
			}
			else {				
				throw new Error('Search request failed!')
			}
		}, (networkError) => {
			console.log(networkError.message);
		}).then((jsonResponse) => {
			return jsonResponse.tracks.items.map((track) => {
				return {
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri
				}
			})
		});

	}, 

	savePlaylist(playlistName, trackURIs) {

		// Check for null parameters
		if (playlistName == null || trackURIs == null) {
			return;
		}

		// Set up the variables required for access
		const accessToken = this.getAccessToken();
		const requestHeaders = {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'};
		let userID = '';
		let playlistID = '';

		// Get the userID of the current user
		fetch(`https://api.spotify.com/v1/me`, {'headers': requestHeaders}).then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('UserID request failed!');
			}
		}, (networkError) => {
			console.log(networkError.message);
		}).then((jsonResponse) => {
			userID = jsonResponse.id;
			
			// Create a new private playlist, and get the ID
			fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {method: 'POST', body: JSON.stringify({
				name: playlistName,
				public: false,
				description: 'This is a playlist created by the Jammming app!'
			}), 'headers': requestHeaders}).then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('New playlist request failed!');
				}
			}, (networkError) => {
				console.log(networkError.message);
			}).then((response) => {
				playlistID = response.id;
			
				// Add tracks to the new playlist
				fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {method: 'POST', body: JSON.stringify({'uris': trackURIs}), 'headers': requestHeaders}).then((response) => {
					if (response.ok) {
						return;
					} else {
						throw new Error('Add tracks request failed!');
					}
				}, (networkError) => {
					console.log(networkError.message);
				});

			});

		});

	

		

	}

}

export default Spotify;