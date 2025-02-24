import { styleText } from 'node:util';

export default async function showWeatherForLocation(
  location,
  userInput = location
) {
  const result = await lookupCity(location);
  if (!result) {
    console.log(`Kein Ort gefunden für "${userInput}"`);
  } else {
    let temperature = await getTemperature(
      result.latitude,
      result.longitude
    );
    displayWeather(
      `${result.name} (${result.admin1}, ${result.country})`,
      temperature
    );
  }
}

async function lookupCity(location) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${location}&language=de&count=1`
  );
  const data = await response.json();
  if (data.results) {
    let { name, country, admin1, latitude, longitude } =
      data.results[0];
    return { name, country, admin1, latitude, longitude };
  }
}

// Ermittlung der Temperatur
async function getTemperature(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?current_weather=true&latitude=${latitude}&longitude=${longitude}`
  );
  const { current_weather } = await response.json();
  return current_weather?.temperature;
}

// Ausgabe formatieren und anzeigen
function displayWeather(input, temp) {
  let output = styleText('blue', temp + '');
  const now = new Date(); // aktueller Zeitpunkt
  const time = now.toLocaleTimeString('de-DE'); // Zeit in deutschem Format
  const weatherOutput = `Temperatur in ${input} um ${time}: ${output} Grad`;
  console.log(weatherOutput);
}
