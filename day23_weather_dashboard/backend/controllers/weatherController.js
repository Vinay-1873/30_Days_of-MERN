// controllers/weatherController.js
const axios = require('axios');

const getWeather = async (req, res) => {
    try {
        const { city } = req.params;
        const apiKey = process.env.WEATHER_API_KEY;
        const baseUrl = process.env.WEATHER_BASE_URL;
        const response = await axios.get(`${baseUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = response.data;
        req.weatherCache.set(city.toLowerCase(), weatherData);

        res.status(200).json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'City not found' });
        }
        
        res.status(500).json({ message: 'Server error fetching weather data' });
    }
};

module.exports = { getWeather };