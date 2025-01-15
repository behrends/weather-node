// benötigte Imports
import { styleText } from 'node:util';
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Definition der Funktionen

// Ermittlung der Temperatur
function getTemperature() {
  let temp = Math.floor(Math.random() * 10);
  // Ergebnis der Funktion: die Temperatur
  return temp;
}

// Ausgabe formatieren und anzeigen
function displayWeather(input, temp) {
  let output = styleText('blue', temp + ''); // + '' --> erzeugt String
  const now = new Date(); // aktueller Zeitpunkt
  const time = now.toLocaleTimeString('de-DE'); // Zeit in deutschem Format
  const weatherOutput = `Temperatur in ${input} um ${time}: ${output} Grad`;
  console.log(weatherOutput);
  let weatherCond = temp < 5 ? 'Ziemlich kalt!' : 'Nicht zu kalt!';
  console.log(weatherCond);
}

console.log('Willkommen zur Wetter-App!');

// Hauptprogramm
while (true) {
  let input = prompt(
    'Für welche Stadt willst du das Wetter wissen? '
  );
  if (input === 'x') {
    process.exit(0);
  }
  let temperature = getTemperature();
  displayWeather(input, temperature);

  input = prompt('Wie warm hättest du es gerne? ');
  // Eingabe in Zahl konvertieren
  let tempInput = parseInt(input);
  if (isNaN(tempInput)) {
    // ist tempInput keine Zahl
    console.log('Ungültige Eingabe (keine Zahl):', input);
  } else {
    console.log('Deine Wunschtemperatur:', tempInput);
  }
}

