import { styleText } from 'node:util';
import promptSync from 'prompt-sync';
const prompt = promptSync();

// Hauptmenü
function mainMenu() {
  let output = styleText(
    'cyan',
    "Das Programm kann mit der Eingabe 'x' beendet werden."
  );
  console.log(output);
  while (true) {
    let input = promptWithExit(
      'Für welche Stadt willst du das Wetter wissen? '
    );
    let temperature = getTemperature();
    displayWeather(input, temperature);

    input = promptWithExit('Wie warm hättest du es gerne? ');
    let tempInput = parseInt(input); // Eingabe in Zahl konvertieren
    if (isNaN(tempInput)) {
      console.log('Ungültige Eingabe (keine Zahl):', input);
    } else {
      console.log('Deine Wunschtemperatur:', tempInput);
    }
  }
}

// Eingabe mit Prompt und Test, ob Programm beendet werden soll
function promptWithExit(message) {
  const input = prompt(message);
  if (input === 'x') {
    let output = styleText('cyan', 'Auf Wiedersehen!');
    console.log(output);
    process.exit(0);
  }
  return input;
}

// Ermittlung der Temperatur
function getTemperature() {
  return Math.floor(Math.random() * 10);
}

// Ausgabe formatieren und anzeigen
function displayWeather(input, temp) {
  let output = styleText('blue', temp + '');
  const now = new Date(); // aktueller Zeitpunkt
  const time = now.toLocaleTimeString('de-DE'); // Zeit in deutschem Format
  const weatherOutput = `Temperatur in ${input} um ${time}: ${output} Grad`;
  console.log(weatherOutput);
  console.log(temp < 5 ? 'Ziemlich kalt!' : 'Nicht zu kalt!');
}

// starte Hauptmenü
console.log('Willkommen zur Wetter-App!');
mainMenu();
