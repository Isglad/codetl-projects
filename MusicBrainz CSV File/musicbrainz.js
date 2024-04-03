const axios = require('axios');
const fs = require('fs');

// Function to search for the artist you are interested using the `artist` API.

async function searchArtist(artistName){
    try {
        const response = await axios.get(`http://musicbrainz.org/ws/2/artist/?query=${artistName}&fmt=json`);
        if (response.data.artists && response.data.artists.length > 0) {
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
        return response.data.releases;
    } catch (error) {
        console.error('Error listing albums:', error);
        return [];
    }
}

// Function to construct CSV data from album information

function constructCSV(albums, artistName) {
    let csvData = "Artist,Country,Title,Date,Status\n";
    albums.forEach(album => {
        const artist = getArtistName(album, artistName);
        const country = album.country || 'Unknown';
        const title = album.title || 'Unknown';
        const date = album.date || 'Unknown';
        const status = album.status || 'Unknown';
        csvData += `"${artist}","${country}","${title}","${date}","${status}"\n`;
    });
    return csvData;
}

// Function to get artist name from album information

function getArtistName(album, artistName) {
    let artist = 'Unknown';

    // Extract the artist name from the album information
    if (album['artist-credit'] && album['artist-credit'][0] && album['artist-credit'][0].artist) {
        artist = album['artist-credit'][0].artist.name;
    }

    // If the artist name from the album information matches the provided artistName, use it
    if (artist.toLowerCase() === artistName.toLowerCase()) {
        return artist;
    }

    // If not, use the provided artistName
    return artistName;
}

// Main function to orchestrate the process

async function main(artistName) {
    const artist = await searchArtist(artistName);
    if (!artist) {
        console.log('Artist not found.');
        return;
    }
    const albums = await listAlbums(artist.id);
    const csvData = constructCSV(albums, artistName); // Pass artistName here
    fs.writeFileSync('albums.csv', csvData);
    console.log('CSV file created successfully.');
}

// Command line arguments handling

const artistName = process.argv[2];
if (!artistName) {
    console.error('Please provide the artist name as an argument.');
} else {
    main(artistName);
}