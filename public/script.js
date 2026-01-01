let chart;

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

function setIcon(desc) {
  const icon = document.getElementById("icon");
  desc = desc.toLowerCase();

  if (desc.includes("cloud")) icon.innerHTML = "☁️";
  else if (desc.includes("rain")) icon.innerHTML = "🌧️";
  else if (desc.includes("clear")) icon.innerHTML = "☀️";
  else if (desc.includes("snow")) icon.innerHTML = "❄️";
  else icon.innerHTML = "🌫️";
}

async function getWeather() {
  const city = document.getElementById("city").value;
  const output = document.getElementById("output");

  output.innerHTML = "⏳ Loading...";

  const res = await fetch(`/api/weather?city=${city}`);
  const data = await res.json();

  if (data.error) {
    output.innerHTML = data.error;
    return;
  }

  displayWeather(data);
}

function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const res = await fetch(
      `/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
    );
    const data = await res.json();
    displayWeather(data);
  });
}

function displayWeather(data) {
  setIcon(data.description);

  document.getElementById("output").innerHTML = `
    <h3>${data.city}</h3>
    <p>🌡 ${data.temp} °C</p>
    <p>☁ ${data.description}</p>
    <p>💧 ${data.humidity}%</p>
  `;

  drawGraph(data.temp, data.humidity);
}

function drawGraph(temp, humidity) {
  const ctx = document.getElementById("weatherChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Temperature", "Humidity"],
      datasets: [{
        data: [temp, humidity],
        borderWidth: 3
      }]
    }
  });
}


