const API_KEY = '0fbb7d8907234b6b87841817240611'; 
const API_URL = 'https://api.weatherapi.com/v1';

const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

const temperatureElement = document.getElementById('temperature');
const locationElement = document.getElementById('location');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const conditionElement = document.getElementById('condition');
const weatherIconElement = document.getElementById('weatherIcon');

const weatherIcons = {
  sunny: 'fa-sun',
  clear: 'fa-sun',
  'partly cloudy': 'fa-cloud-sun',
  cloudy: 'fa-cloud',
  overcast: 'fa-cloud',
  rain: 'fa-cloud-rain',
  snow: 'fa-snowflake',
  thunder: 'fa-bolt',
};

function getWeatherIcon(condition) {
  const lowerCondition = condition.toLowerCase();
  for (const [key, value] of Object.entries(weatherIcons)) {
    if (lowerCondition.includes(key)) {
      return value;
    }
  }
  return 'fa-cloud'; // default icon
}

async function getWeather(city) {
  try {
    weatherCard.classList.remove('visible');
    loadingElement.classList.add('visible');
    errorElement.classList.remove('visible');

    const response = await fetch(
      `${API_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();

    // Update UI with weather data
    temperatureElement.textContent = `${Math.round(data.current.temp_c)}°C`;
    locationElement.textContent = `${data.location.name}, ${data.location.country}`;
    humidityElement.textContent = `${data.current.humidity}%`;
    windSpeedElement.textContent = `${data.current.wind_kph} km/h`;
    conditionElement.textContent = data.current.condition.text;

    // Update weather icon
    weatherIconElement.className =
      'weather-icon fas ' + getWeatherIcon(data.current.condition.text);

    // Show weather card
    weatherCard.classList.add('visible');
  } catch (error) {
    errorElement.classList.add('visible');
  } finally {
    loadingElement.classList.remove('visible');
  }
}

// Event listener for search input
let debounceTimer;
cityInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  if (e.target.value.trim().length > 2) {
    debounceTimer = setTimeout(() => {
      getWeather(e.target.value.trim());
    }, 500);
  }
});

// Event listener for Enter key
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.target.value.trim().length > 2) {
    getWeather(e.target.value.trim());
  }
});
