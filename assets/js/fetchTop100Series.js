// Fetch Top 100 Series
const top100SeriesUrl = 'https://imdb-top-100-movies.p.rapidapi.com/series/';
const top100Series = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'fc24b5238bmsheb4a0dd18a03c6ap169648jsnc5c7101398f8',
        'X-RapidAPI-Host': 'imdb-top-100-movies.p.rapidapi.com'
    }
};

async function fetchTop100Series() {
    try {
        const response = await fetch(top100SeriesUrl, top100Series);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        return [];
    }
}
