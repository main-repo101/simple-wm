class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey || 'ignore';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getCurrentWeather() {
        try {
            let position;
            try {
                position = await this.getCurrentPosition();
            } catch (error) {
                //REM: Default... (fallback)
                position = {
                    coords: {
                        latitude: 7.051399,
                        longitude: 125.594770
                    }
                };
            }

            // const response = await fetch(
            //     `${this.baseUrl}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${this.apiKey}`
            // );

            const apiUrl = `${this.baseUrl}?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`;
            const response = await fetch('proxy.php',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        _url: apiUrl,
                        _type: "weather"
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Weather data fetch failed: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                temp: data.main.temp,
                condition: data.weather[0].main,
                description: data.weather[0].description,
                location: data.name
            };
        } catch (error) {
            console.error('Error fetching weather:', error.message);
            throw new Error('Unable to fetch weather data. Please try again later.');
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
}