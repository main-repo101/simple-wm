const weatherService    = new WeatherService();
const musicService      = new MusicService();
const playerController  = new PlayerController();

let currentPlaylist = [];

async function initialize() {
    try {
        //REM: Get weather data
        const weatherData = await weatherService.getCurrentWeather();

        // weatherData.condition = "Tornado";
        // weatherData.description = "Tor hammer"

        updateWeatherUI(weatherData);
        
        //REM: Get music based on weather
        const playlist = await musicService.getPlaylistByMood(getMoodFromWeather(weatherData));
        currentPlaylist = playlist;
        playerController.setPlaylist(playlist);
        updatePlaylistUI(playlist, weatherData);
        
        //REM: Setup player controls
        setupPlayerControls();
    } catch (error) {
        console.error('Error initializing app:', error.message);
        document.getElementById('weather-info').innerHTML = '<p>Unable to load weather data. Please try again later.</p>';
    }
}

function updateWeatherUI(weatherData) {
    document.getElementById('temperature').textContent  = `${Math.round(weatherData.temp)}°C`;
    document.getElementById('description').textContent  = weatherData.description;
    document.getElementById('location').textContent     = weatherData.location;
    document.getElementById('weather-icon').textContent = getWeatherEmoji(weatherData.condition);
}

function getWeatherEmoji(condition) {
    //REM: emoji online: https://emojipedia.org/search?q=weather
    const emojiMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Drizzle': '🌦️',
        'Tornado': '🌪️',
        'Mist': '🌫️'
    };
    return emojiMap[condition] || '🌍';
}

function getMoodFromWeather(weatherData) {
    const moodMap = {
        'Clear': 'happy',               
        'Clouds': 'chill',              
        'Rain': 'melancholic',          
        'Snow': 'peaceful',             
        'Thunderstorm': 'intense',       
        'Drizzle': 'relaxed',           
        'Mist': 'mysterious',           
        'Smoke': 'mysterious',          
        'Haze': 'mysterious',           
        'Dust': 'mysterious',           
        'Fog': 'mysterious',            
        'Sand': 'mysterious',           
        'Ash': 'intense',               
        'Squall': 'intense',            
        'Tornado': 'intense',           
        'Overcast Clouds': 'chill',       
        'Few Clouds': 'relaxed',        
        'Scattered Clouds': 'relaxed',  
        'Broken Clouds': 'chill'        
    };

    // Default to 'neutral' if the condition is not mapped
    return moodMap[weatherData.condition] || 'neutral';

    // return moodMap['Drizzle'] || 'neutral';
}

function updatePlaylistUI(playlist, weatherData) {
    console.log('Playlist data passed to UI:', playlist); // Debugging log

    const playlistElement = document.getElementById('playlist');
    const playlistMoodElement = document.getElementById('playlist-mood');
    
    if (playlist.length === 0) {
        playlistMoodElement.textContent = 'No playable tracks available for the current mood.';
        playlistElement.innerHTML = '<li>No playable tracks available</li>';
        playerController.stop(); // Stop playback if no tracks are available
        return;
    }

    playlistMoodElement.textContent = `Current Mood: ${getMoodFromWeather(weatherData)}`;
    
    playlistElement.innerHTML = playlist.map((track, index) => `
        <li data-index="${index}">
            ${track.name} - ${track.artist}
            <p>Genre: ${track.playlistMood ? track.playlistMood.name : 'Unknown'}</p>
        </li>
    `).join('');
}

function setupPlayerControls() {
    const playButton = document.getElementById('play-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    playButton.addEventListener('click', () => playerController.togglePlay());
    prevButton.addEventListener('click', () => playerController.playPrevious());
    nextButton.addEventListener('click', () => playerController.playNext());
    
    document.getElementById('playlist').addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (li) {
            const index = parseInt(li.dataset.index);
            playerController.playTrack(index);
        }
    });
}

//REM: Initialize the application
document.addEventListener('DOMContentLoaded', initialize);