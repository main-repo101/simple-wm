class PlayerController {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.playlist = [];
        this.currentIndex = 0;
        this.player = null;
    }

    setPlaylist(playlist) {
        this.playlist = playlist;
        this.currentIndex = 0;
    }

    async togglePlay() {
        if (!this.player && this.playlist.length > 0) {
            await this.playTrack(0);
        } else if (this.player) {
            if (this.isPlaying) {
                this.player.pauseVideo();
                this.updatePlayButton('Play');
                this.isPlaying = false;
            } else {
                this.player.playVideo();
                this.updatePlayButton('Pause');
                this.isPlaying = true;
            }
        }
    }

    async playTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentIndex = index;
        const track = this.playlist[index];
        console.log(`Attempting to play track: ${track.name} - ${track.artist}, URL: ${track.url}`);

        const videoId = this.extractYouTubeVideoId(track.url);
        if (!videoId) {
            console.warn('Invalid YouTube URL. Skipping to the next track.');
            this.playNext();
            return;
        }

        if (!this.player) {
            this.initializeYouTubePlayer(videoId);
        } else {
            this.player.loadVideoById(videoId);
        }

        this.updateNowPlaying(track);
        this.updatePlayButton('Pause');
        this.isPlaying = true;
    }

    initializeYouTubePlayer(videoId) {
        this.player = new YT.Player('youtube-player', {
            height: '0',
            width: '0', 
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        this.playNext();
                    }
                },
                onError: (event) => {
                    console.error('YouTube Player Error:', event);
                    this.handlePlaybackError();
                }
            }
        });
    }

    extractYouTubeVideoId(url) {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
        return match ? match[1] : null;
    }

    handlePlaybackError() {
        console.warn('Skipping to the next track due to playback error.');
        const nextIndex = (this.currentIndex + 1) % this.playlist.length;

        if (nextIndex === this.currentIndex) {
            console.error('All tracks failed to play. Stopping playback.');
            this.updatePlayButton('Play');
            this.isPlaying = false;
            return;
        }

        this.playTrack(nextIndex);
    }

    playNext() {
        const nextIndex = (this.currentIndex + 1) % this.playlist.length;
        this.playTrack(nextIndex);
    }

    playPrevious() {
        const prevIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.playTrack(prevIndex);
    }

    updatePlayButton(text) {
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.textContent = text;
        }
    }

    updateNowPlaying(track) {
        const nowPlayingElement = document.getElementById('now-playing');
        if (nowPlayingElement) {
            nowPlayingElement.textContent = `Now Playing: ${track.name} - ${track.artist}`;
        }
    }
}