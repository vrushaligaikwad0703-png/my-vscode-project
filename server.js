const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 5000;

// 👉 PASTE YOUR API KEY HERE
const API_KEY = "73b4ba800183104e6547cc857a33ad05";

app.use(express.static("public"));

app.get("/api/weather", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let url = "";

    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      return res.json({ error: "Invalid request" });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.json({ error: "City not found" });
    }

    res.json({
      city: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    });
  } catch (err) {
    res.json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

