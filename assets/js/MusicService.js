class MusicService {
    constructor() {
        this.proxyUrl = 'proxy.php';
    }

    playlistIndexExists(array_i, array_ii) {
        if (!Array.isArray(array_i) || !Array.isArray(array_ii)) {
            return [];
        }
        return array_i.filter(value => array_ii.includes(value));
    }

    async getPlaylistByMood(mood) {
        try {
            // const playlistMoodMap = {
            //     'happy': ['pop', 'indie', 'rock', 'dance', 'electro', 'hiphop', 'rap'],
            //     'chill': ['electro', 'lofi', 'lo-fi', 'loft', 'lounge', 'soul', "latinx"],
            //     'melancholic': ['classical', 'traditional', 'folk', 'country', 'blues', 'jazz'],
            //     'peaceful': ['ambient', 'acoustic', 'folk', 'country', 'reggae', 'soul', 'blues', 'jazz', "shoegaze"],
            //     'intense': ['rock', 'psychedelic', 'metal', 'punk'],
            //     'relaxed': ['jazz', 'blues', 'soul', 'reggae', 'funk', 'rnb', 'hiphop', 'rap'],
            //     'mysterious': ['world', 'mystery', 'soundtrack', 'pop'],
            // };

            // const genres = playlistMoodMap[mood] || [];

            const playlistMoodMap = {
                "chill": 0,
                "happy": 1,
                "melancholic": 2,
                "peaceful": 3,
                "intense": 4,
                "relaxed": 5,
                "mysterious": 6
            };

            const playlistIndex = playlistMoodMap[mood] || 0;

            console.log(`::: mode: '${mood}' | playlistIndex: '${playlistIndex}'`);

            // const apiUrl = `https://openwhyd.org/hot/${playlistIndex}?format=json`;

            // const apiUrl = `https://openwhyd.org/hot?format=json`;

            const apiUrl = `https://openwhyd.org/u`;

            console.log('Fetching playlist for playlistIndex:', playlistIndex, 'API URL:', apiUrl);

            const response = await fetch(`${this.proxyUrl}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    _url: apiUrl, 
                    _type: "music",
                    _playlistIndex: playlistIndex
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch music data: ${response.statusText}`);
            }

            const data = await response.json();

            console.log('Raw API response:', data);

            if (!data || data.length === 0) {
                console.warn('No tracks found in the API response.');
                return [];
            }

            // if (!data.tracks || data.tracks.length === 0) {
            //     console.warn('No tracks found in the API response.');
            //     return [];
            // }

            const playlist = data/*.tracks*/
                .filter(track => {

                    if (!track || /*!track.trackUrl*/ !track.eId || !track.name || !track.uNm) {
                        return false;
                    }

                    // //REM: Check if the track belongs to the selected playlistIndexs
                    // if (playlistIndex.length > 0 && track.pl && track.pl.name) {

                    //     const genres = track.pl.name.split(/[, -]+/).map(g => g.toLowerCase().trim());

                    //     if (!genres.some(g => playlistIndex.includes(g))) {

                    //         return false;
                    //     }
                    // }

                    return true;
                })
                .map(track => ({
                    id: track._id || 'unknown',
                    name: track.name || 'Unknown Title',
                    artist: track.uNm || 'Unknown Artist',
                    // url: track.trackUrl.startsWith('http') ? track.trackUrl : `https:${track.trackUrl}`,
                    url: `https://www.youtube.com/watch?v=${track.eId.replace(/^[\/]*yt\//, '')}`,
                    playlistMood: track.pl || undefined
                }));



            playlist.sort((a, b) => {
                const aName = a.playlistMood?.name?.toLowerCase() || "unknown";
                const bName = b.playlistMood?.name?.toLowerCase() || "unknown";

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
