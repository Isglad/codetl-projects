const axios = require('axios');
const fs = require('fs');

// Function to search for the artist you are interested using the `artist` API.

async function searchArtist(artistName){
    try {
        const response = await axios.get(`http://musicbrainz.org/ws/2/artist/?query=${artistName}&fmt=json`);
        // console.log('Response from MusicBrainz API:', response.data);
        if (response.data.artists && response.data.artists.length > 0) {
            console.log(artistName + " is an artist!");
            return response.data.artists[0]; // Assuming the first artist in the response is the intended one
        } else {
            console.log('Artist not found.');
            return null;
        }
    } catch(error) {
        console.error('Error searching for the artist:', error);
        return null;
    }
}

// Function to list all albums of a given artist using the `release` API.

async function listAlbums(artistId) {
    try {
        const response = await axios.get(`http://musicbrainz.org/ws/2/release/?artist=${artistId}&fmt=json`);
        console.log('Response from release API:', response.data.releases);
        return response.data.releases;
    } catch (error) {
        console.error('Error listing albums:', error);
        return [];
    }
}