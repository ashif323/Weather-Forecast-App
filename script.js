const apiKey = "8032797467894a85a90131559252708"; // 🔑 Replace with your WeatherAPI key

// Fetch weather by city name
function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (city === "") return alert("Please enter a city name!");
  fetchWeather(city);
}

// Fetch weather by current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(`${lat},${lon}`);
      },
      () => alert("Location access denied. Please search manually.")
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Auto-fetch on page load (with location)
window.onload = () => {
  getLocation();
};

// Fetch weather + forecast data
async function fetchWeather(query) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5&aqi=yes&alerts=yes`
    );

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    // Handle API error (like invalid city)
    if (data.error) {
      alert("❌ " + data.error.message);
      return;
    }

    // ✅ Show data
    displayCurrentWeather(data);
    displayForecast(data.forecast.forecastday);

  } catch (error) {
    console.error("Weather fetch error:", error);
    alert("⚠️ Failed to fetch weather data. Please check your API key or city name.");
  }
}


// Display current weather
function displayCurrentWeather(data) {
  const weatherInfo = document.getElementById("weatherInfo");
  weatherInfo.innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <p>${data.current.condition.text}</p>
    <img src="https:${data.current.condition.icon}" alt="weather icon">
    <p>🌡️ ${data.current.temp_c}°C | 💨 ${data.current.wind_kph} km/h</p>
  `;
}

// Display 5-day forecast
function displayForecast(forecast) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";
  forecast.forEach((day) => {
    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <h4>${day.date}</h4>
        <img src="https:${day.day.condition.icon}" alt="icon">
        <p>${day.day.condition.text}</p>
        <p>🌡️ ${day.day.avgtemp_c}°C</p>
      </div>
    `;
  });
}

// Display weather alerts
function displayAlerts(alerts) {
  const alertsDiv = document.getElementById("alerts");
  alertsDiv.innerHTML = "";
  if (alerts && alerts.alert && alerts.alert.length > 0) {
    alertsDiv.innerHTML = "<h3>⚠️ Weather Alerts</h3>";
    alerts.alert.forEach((alert) => {
      alertsDiv.innerHTML += `<p><b>${alert.headline}</b>: ${alert.desc}</p>`;
    });
  }
}
