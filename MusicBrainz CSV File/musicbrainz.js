const axios = require('axios');
const fs = require('fs');

// Function to search for an artist using the MusicBrainz API

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