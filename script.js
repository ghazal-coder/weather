const apiKey = '442dd88fa1a6154298c5d44afdfe5078';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const backgroundImage = document.querySelector('.background-image');

searchButton.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value;
    if (city) {
        try {
            const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);

            const currentData = await currentWeatherResponse.json();
            const forecastData = await forecastResponse.json();

            if (currentData.cod === 200) {
                displayCurrentWeather(currentData);
                displayHourlyForecast(forecastData);
                displayDailyForecast(forecastData);
                setBackgroundImage(currentData.weather[0].main);
                weatherContainer.classList.remove('hidden');
            } else {
                alert('City not found!');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching weather data.');
        }
    } else {
        alert('Please enter a city name!');
    }
}

function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById('weather-description').textContent = data.weather[0].description;
    document.getElementById('temp-high').textContent = `H:${Math.round(data.main.temp_max)}°`;
    document.getElementById('temp-low').textContent = `L:${Math.round(data.main.temp_min)}°`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
}

function displayHourlyForecast(data) {
    const hourlyContainer = document.getElementById('hourly-container');
    hourlyContainer.innerHTML = '';
    
    data.list.slice(0, 24).forEach(item => {
        const hourlyItem = document.createElement('div');
        hourlyItem.classList.add('forecast-item');
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        hourlyItem.innerHTML = `
            <p>${time}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather icon">
            <p>${Math.round(item.main.temp)}°</p>
        `;
        hourlyContainer.appendChild(hourlyItem);
    });
}

function displayDailyForecast(data) {
    const dailyContainer = document.getElementById('daily-container');
    dailyContainer.innerHTML = '';
    
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    dailyData.forEach(item => {
        const dailyItem = document.createElement('div');
        dailyItem.classList.add('forecast-item');
        const day = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        dailyItem.innerHTML = `
            <p>${day}</p>
            <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather icon">
            <p>${Math.round(item.main.temp)}°</p>
        `;
        dailyContainer.appendChild(dailyItem);
    });
}

function setBackgroundImage(weatherCondition) {
    let imageUrl;
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            imageUrl = 'sky.jpeg';
            break;
        case 'clouds':
            imageUrl = 'clear-sky.jpeg';
            break;
        case 'rain':
            imageUrl = 'rainy.png';
            break;
        // Add more cases for different weather conditions
        default:
            imageUrl = 'weather.webp';
    }
    backgroundImage.style.backgroundImage = `url('${imageUrl}')`;
}