class MusicService {
    constructor() {
        this.proxyUrl = 'proxy.php';
    }

    genreExists(array_i, array_ii) {
        if (!Array.isArray(array_i) || !Array.isArray(array_ii)) {
            return [];
        }
        return array_i.filter(value => array_ii.includes(value));
    }

    async getPlaylistByMood(mood) {
        try {
            const genreMap = {
                'happy': ['pop', 'indie', 'rock', 'dance', 'electro', 'hiphop', 'rap'],
                'chill': ['electro', 'loft', 'lounge', 'soul', "latinx"],
                'melancholic': ['classical', 'traditional', 'folk', 'country', 'blues', 'jazz'],
                'peaceful': ['ambient', 'acoustic', 'folk', 'country', 'reggae', 'soul', 'blues', 'jazz', "shoegaze"],
                'intense': ['rock', 'psychedelic', 'metal', 'punk'],
                'relaxed': ['jazz', 'blues', 'soul', 'reggae', 'funk', 'rnb', 'hiphop', 'rap'],
                'mysterious': ['world', 'mystery', 'soundtrack', 'pop'],
            };

            const genre = genreMap[mood] || [];

            console.log(`::: mode: '${mood}' | genre: '${genre}'`);

            // const apiUrl = `https://openwhyd.org/hot/${genre}?format=json`;

            const apiUrl = `https://openwhyd.org/hot?format=json`;
            console.log('Fetching playlist for genre:', genre, 'API URL:', apiUrl);

            const response = await fetch(`${this.proxyUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _url: apiUrl, 
                    _type: "music" 
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch music data: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Raw API response:', data);

            if (!data.tracks || data.tracks.length === 0) {
                console.warn('No tracks found in the API response.');
                return [];
            }



            const playlist = data.tracks
                .filter(track => {
                    if (!track || !track.trackUrl || !track.name || !track.uNm) {
                        return false;
                    }

                    // Check if the track belongs to the selected genres
                    if (genre.length > 0 && track.pl && track.pl.name) {

                        const trackGenres = track.pl.name.split(',').map(g => g.toLowerCase().trim());

                        if (!trackGenres.some(g => genre.includes(g))) {

                            return false;
                        }
                    }

                    return true;
                })
                .map(track => ({
                    id: track._id || 'unknown',
                    name: track.name || 'Unknown Title',
                    artist: track.uNm || 'Unknown Artist',
                    url: track.trackUrl.startsWith('http') ? track.trackUrl : `https:${track.trackUrl}`,
                    genre: track.pl || undefined
                }));



            playlist.sort((a, b) => {
                const aName = a.genre?.name?.toLowerCase() || "unknown";
                const bName = b.genre?.name?.toLowerCase() || "unknown";

                if (aName === "unknown" && bName !== "unknown") return 1;
                if (bName === "unknown" && aName !== "unknown") return -1;
                return 0;
            });

            console.log('Processed playlist:', playlist);

            return playlist;
        } catch (error) {
            console.error('Error fetching music:', error.message);
            throw new Error('Unable to fetch music data. Please try again later.');
        }
    }
}
