<?php

header('Content-Type: text/html; charset=UTF-8');

?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Music Player</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://www.youtube.com/iframe_api"></script>
</head>
<body>
    <div class="container">
        <div class="weather-section">
            <h1>Weather Music Player</h1>
            <div id="weather-info">
                <div id="weather-icon"></div>
                <div id="temperature"></div>
                <div id="description"></div>
                <div id="location"></div>
            </div>
        </div>
        <div class="player-section">
            <h2>Current Playlist</h2>
            <div id="playlist-mood"></div>
            <div id="player-controls">
                <button id="prev-button">Previous</button>
                <button id="play-button">Play</button>
                <button id="next-button">Next</button>
            </div>
            <div id="now-playing"></div>
            <ul id="playlist"></ul>
        </div>
        <div id="youtube-player"></div> <!-- Hidden YouTube Player -->
    </div>
    <script src="assets/js/WeatherService.js"></script>
    <script src="assets/js/MusicService.js"></script>
    <script src="assets/js/PlayerController.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>