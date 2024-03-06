// Top 100 Movies
const top100MoviesUrl = 'https://imdb-top-100-movies.p.rapidapi.com/';
const top100Movies = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'fc24b5238bmsheb4a0dd18a03c6ap169648jsnc5c7101398f8',
        'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
    }
};

async function fetchTop100Movies() {
    try {
        const response = await fetch(top100MoviesUrl, top100Movies);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}