'use strict'
// API Dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Globals
const PORT = process.env.PORT || 3009;

// Make the server
const app = express();
app.use(cors());

// Location Route
app.get('/location', (request, response) => {
  // console.log(request.query.data);
  try {
    const locationData = searchToLatLng(request.query.data);
    response.send(locationData);
  }
  catch (e) {
    response.status(500).send('Status 500, not functional.');
  }
});

// Weather Route
app.get('/weather', (request, response) => {
  try {
    const weatherData = getWeatherRoute(request.query.data);
    response.send(weatherData);
  }
  catch (e) {
    response.status(500).send('Status 500, not functional.');
  }
});

// app.use('*', (request, response) => {
//   response.send('you got to the wrong place');
// });

function Location(name, formatted, lat, lng) {
  this.search_query = name;
  this.formatted_query = formatted;
  this.latitude = lat;
  this.longitude = lng;
}


function searchToLatLng(locationName) {
  const geoData = require('./data/geo.json');
  let location = new Location(
    locationName,
    geoData.results[0].formatted_address,
    geoData.results[0].geometry.location.lat,
    geoData.results[0].geometry.location.lng
  );
  return location;
}

function Day(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function getWeatherRoute(locationName) {
  const weatherData = require('./data/darksky.json');
  let daysArr = [];
  let time;
  for (let day of weatherData.daily.data) {
    time = new Date(day.time*1000).toDateString();
    daysArr.push(new Day (day.summary, time));
  }
  return daysArr;
}

// Start the server.
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
