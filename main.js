import { styleText } from 'node:util';
import promptSync from 'prompt-sync';
const prompt = promptSync();

const cities = [
  {
    id: 1,
    name: 'Basel',
  },
  {
    id: 2,
    name: 'Freiburg',
  },
  {
    id: 3,
    name: 'Lörrach',
  },
  {
    id: 4,
    name: 'Oslo',
  },
  {
    id: 5,
    name: 'Sydney',
  },
];

// Hauptmenü
function mainMenu() {
  let output = styleText(
    'cyan',
    "Das Programm kann mit der Eingabe 'x' beendet werden."
  );
  console.log(output);
  while (true) {
    console.clear();
    console.log(`
      ***** Hauptmenü *****
      1 - Ort eingeben
      2 - Stadt wählen
      x - Programm beenden 
     `);
    let input = promptWithExit('Deine Eingabe: ');
    if (input === '1') {
      input = promptWithExit('Ort eingeben: ');
      let temperature = getTemperature();
      displayWeather(input, temperature);
      input = promptWithExit('Weiter mit Enter');
    } else if (input === '2') {
      console.log(`***** Stadt wählen *****`);
      cities.forEach((city) => {
        console.log(`${city.id} - ${city.name}`);
      });
      input = promptWithExit('Deine Eingabe: ');
      const city = cities.find((city) => city.id === Number(input));
      if (!city) {
        console.log('Ungültige Eingabe.');
        input = promptWithExit('Weiter mit Enter');
        continue;
      }
      let temperature = getTemperature();
      displayWeather(city.name, temperature);
      input = promptWithExit('Weiter mit Enter');
    } else {
      console.log('Bitte gib 1, 2 oder x ein.');
      input = promptWithExit('Weiter mit Enter');
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
