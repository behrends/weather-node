import { styleText } from 'node:util';
import fs from 'fs';
import promptSync from 'prompt-sync';
import showWeatherForLocation from './lib/weather-location.js';
import Location from './lib/location.js';
import aiSearch from './lib/ai.js';

const prompt = promptSync();

let locationList = [];
try {
  const jsonData = await import('./data.json', {
    with: { type: 'json' },
  });
  locationList = jsonData.default;
} catch (error) {
  console.log('Keine Daten gefunden!');
  prompt('Weiter mit beliebiger Taste');
}

// Hauptmenü
async function mainMenu() {
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
      3 - KI-Suche
      x - Programm beenden 
     `);
    let input = promptWithExit('Deine Eingabe: ');
    if (input === '1') {
      input = promptWithExit('Ort eingeben: ');
      const location = await showWeatherForLocation(input);
      if (location) {
        const newLocation = new Location(
          locationList.length + 1,
          location.name
        );
        // check if location already exists
        const loc = locationList.find(
          (item) => item.name === location.name
        );
        if (!loc) {
          locationList.push(newLocation);
          const jsonString = JSON.stringify(locationList);
          fs.writeFileSync('./data.json', jsonString);
        }
      }
    } else if (input === '2') {
      if (!locationList.length) {
        console.log('Keine Städte gefunden!');
      } else {
        console.log(`***** Stadt wählen *****`);
        locationList.forEach((city) => {
          console.log(`${city.id} - ${city.name}`);
        });
        input = promptWithExit('Deine Eingabe: ');
        const city = locationList.find(
          (city) => city.id === parseInt(input)
        );
        if (!city) {
          console.log('Ungültige Eingabe.');
        } else {
          await showWeatherForLocation(city.name);
        }
      }
    } else if (input === '3') {
      let location = await aiSearch();
      if (location) {
        await showWeatherForLocation(location, input);
        // console.clear();
        // await weatherByLocation(location);
        // addLocation(location);
      }
    } else {
      console.log('Bitte gib 1, 2 oder x ein.');
    }
    promptWithExit('Weiter mit Enter');
  }
}

async function askAIForLocation(input) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'developer',
        content:
          'Du bekommst Beschreibungen von Orten und lieferst nur die passende Stadt. Wenn du keine Stadt findest, dann antwortest du mit "no result". Überprüfe deine eigene Antwort, ob es die Stadt wirklich gibt. Sonst gibst du mir keine weiteren Texte.',
      },
      { role: 'user', content: input },
    ],
    model: 'gpt-4o-mini',
  });
  return completion.choices[0].message.content;
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

// starte Hauptmenü
console.log('Willkommen zur Wetter-App!');
mainMenu();
